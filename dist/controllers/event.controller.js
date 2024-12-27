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
exports.updateEventController = exports.createEventController = exports.getEventController = exports.getEventsByUserController = exports.getEventsController = void 0;
const get_events_service_1 = require("../services/event/get-events.service");
const create_event_service_1 = require("../services/event/create-event.service");
const get_event_service_1 = require("../services/event/get-event.service");
const get_events_by_user_service_1 = require("../services/event/get-events-by-user.service");
const update_event_service_1 = require("../services/event/update-event.service");
const prisma_1 = __importDefault(require("../lib/prisma"));
const getEventsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            take: parseInt(req.query.take) || 3,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
            search: req.query.search || "",
        };
        const result = yield (0, get_events_service_1.getEventsService)(query);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventsController = getEventsController;
const getEventsByUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const result = yield (0, get_events_by_user_service_1.getEventsByUserService)(userId);
        if (result.length === 0) {
            res.status(404).json({
                status: "success",
                message: "No events found.",
            });
            return;
        }
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventsByUserController = getEventsByUserController;
const getEventController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield (0, get_event_service_1.getEventService)(id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventController = getEventController;
const createEventController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const result = yield (0, create_event_service_1.createEventService)(req.body, (_a = files.thumbnail) === null || _a === void 0 ? void 0 : _a[0], res.locals.user.id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.createEventController = createEventController;
const updateEventController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thumbnail = req.file;
        const eventId = Number(req.params.id);
        const userId = res.locals.user.id;
        // Ambil event untuk memeriksa pemiliknya
        const currentEvent = yield prisma_1.default.event.findUnique({
            where: { id: eventId },
        });
        if (!currentEvent) {
            res.status(404).json({ status: "error", message: "Event not found." });
            return;
        }
        // Cek apakah pemilik event adalah user yang sedang mengedit
        if (currentEvent.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You are not authorized to edit this event.",
            });
            return;
        }
        // Jika pemilik sama, lanjutkan untuk memperbarui event
        const result = yield (0, update_event_service_1.updateEventService)(eventId, Object.assign(Object.assign({}, req.body), { thumbnail }));
        res.status(200).json({ status: "success", data: result }); // Kembalikan respons yang sesuai
    }
    catch (error) {
        next(error); // Lewatkan kesalahan ke middleware error handler
    }
});
exports.updateEventController = updateEventController;
