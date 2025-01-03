"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const updateEventService = (eventId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, category, address, startTime, endTime, availableSeat, price, thumbnail, } = body;
        if (title) {
            const existingEvent = yield prisma_1.default.event.findFirst({
                where: { title, id: { not: eventId } },
            });
            if (existingEvent) {
                throw new Error("Event title already in use");
            }
        }
        const currentEvent = yield prisma_1.default.event.findUnique({
            where: { id: eventId },
        });
        if (!currentEvent) {
            throw new Error("Event not found");
        }
        let thumbnailUrl = currentEvent.thumbnail;
        if (thumbnail) {
            if (currentEvent.thumbnail) {
                yield (0, cloudinary_1.cloudinaryRemove)(currentEvent.thumbnail);
            }
            const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(thumbnail);
            thumbnailUrl = secure_url;
        }
        return yield prisma_1.default.event.update({
            where: { id: eventId },
            data: {
                title: title || currentEvent.title,
                content: content || currentEvent.content,
                category: category || currentEvent.category,
                address: address || currentEvent.address,
                price: price !== undefined ? Number(price) : currentEvent.price,
                availableSeat: availableSeat !== undefined
                    ? Number(availableSeat)
                    : currentEvent.availableSeat,
                startTime: startTime ? new Date(startTime) : currentEvent.startTime,
                endTime: endTime ? new Date(endTime) : currentEvent.endTime,
                thumbnail: thumbnailUrl,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updateEventService = updateEventService;
