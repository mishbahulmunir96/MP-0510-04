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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsStatisticsController = void 0;
const get_events_statistics_service_1 = require("../services/statistic/get-events-statistics.service");
const getEventsStatisticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = req.query.year; // Cast query to string
        const month = req.query.month; // Cast query to string
        const day = req.query.day; // Cast query to string
        // Validasi input year, month, day
        if (year && isNaN(Number(year))) {
            res.status(400).json({ message: "Invalid year parameter." });
            return;
        }
        if (month &&
            (isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12)) {
            res.status(400).json({ message: "Invalid month parameter." });
            return;
        }
        if (day && (isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31)) {
            res.status(400).json({ message: "Invalid day parameter." });
            return;
        }
        // Validasi tambahan untuk bulan dan hari
        if (month && day) {
            const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
            if (Number(day) > daysInMonth) {
                res.status(400).json({ message: "Invalid day for the given month." });
                return;
            }
        }
        const userId = res.locals.user.id;
        const statistics = yield (0, get_events_statistics_service_1.getEventsStatisticsService)({
            userId,
            year,
            month,
            day,
        });
        res.status(200).json(statistics);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventsStatisticsController = getEventsStatisticsController;
