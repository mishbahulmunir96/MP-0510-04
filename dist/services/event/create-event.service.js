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
exports.createEventService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const createEventService = (body, thumbnail, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = body;
        const event = yield prisma_1.default.event.findFirst({
            where: { title },
        });
        if (event) {
            throw new Error("Title already in use");
        }
        const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(thumbnail);

        return yield prisma_1.default.event.create({
          data: Object.assign(Object.assign({}, body), { thumbnail: secure_url, userId: userId }),
        });
    }
    catch (error) {
        throw error;
    }
});
exports.createEventService = createEventService;
