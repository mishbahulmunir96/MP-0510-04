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
exports.getEventsStatisticsService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const getEventsStatisticsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, year, month, day, }) {
    try {
        const filters = {
            eventId: {
                in: yield prisma_1.default.event
                    .findMany({ where: { userId }, select: { id: true } })
                    .then((events) => events.map((event) => event.id)),
            },
        };
        if (year) {
            filters.createdAt = {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${Number(year) + 1}-01-01`),
            };
        }
        if (month) {
            filters.createdAt = {
                gte: new Date(`${year}-${month}-01`),
                lt: month === "12"
                    ? new Date(`${Number(year) + 1}-01-01`)
                    : new Date(`${year}-${Number(month) + 1}-01`),
            };
        }
        if (day) {
            filters.createdAt = {
                gte: new Date(`${year}-${month}-${day}`),
                lt: new Date(`${year}-${month}-${Number(day) + 1}`),
            };
        }
        const statistics = yield prisma_1.default.transaction.groupBy({
            by: ["eventId"],
            _count: { id: true },
            _sum: { amount: true, ticketCount: true },
            where: filters,
        });
        const events = yield prisma_1.default.event.findMany({
            where: { id: { in: statistics.map((stat) => stat.eventId) } },
            select: { id: true, title: true, startTime: true },
        });
        const formattedStatistics = statistics.map((stat) => {
            const event = events.find((e) => e.id === stat.eventId);
            return {
                eventId: stat.eventId,
                title: (event === null || event === void 0 ? void 0 : event.title) || "Unknown Event",
                startTime: (event === null || event === void 0 ? void 0 : event.startTime) || "Unknown Time",
                totalTransactions: stat._count.id,
                totalRevenue: stat._sum.amount || 0,
                totalTicketsSold: stat._sum.ticketCount || 0,
            };
        });
        return formattedStatistics;
    }
    catch (error) {
        throw error;
    }
});
exports.getEventsStatisticsService = getEventsStatisticsService;
