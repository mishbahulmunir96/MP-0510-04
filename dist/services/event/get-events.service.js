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
exports.getEventsService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const getEventsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, sortBy, sortOrder, take, search } = query;
        const whereClause = { deletedAt: null };
        if (search) {

            whereClause.OR = [{ title: { contains: search, mode: "insensitive" } }];
        }
        const events = yield prisma_1.default.event.findMany({
            where: whereClause,
            skip: (page - 1) * take,
            take: take,
            orderBy: { [sortBy]: sortOrder },
        });

        const count = yield prisma_1.default.event.count({ where: whereClause });

        return {
            data: events,
            meta: { page, take, total: count },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getEventsService = getEventsService;
