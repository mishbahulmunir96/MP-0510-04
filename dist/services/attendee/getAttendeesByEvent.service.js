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
exports.getAttendeesByEventService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const getAttendeesByEventService = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendees = yield prisma_1.default.transaction.findMany({
            where: { eventId, status: "done" }, // Hanya transaksi dengan status "done" yang dianggap sebagai attendees
            select: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                ticketCount: true,
                amount: true,
            },
        });
        return attendees.map((attendee) => ({
            name: `${attendee.user.firstName} ${attendee.user.lastName}`,
            email: attendee.user.email,
            ticketCount: attendee.ticketCount,
            totalPrice: attendee.amount,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.getAttendeesByEventService = getAttendeesByEventService;
