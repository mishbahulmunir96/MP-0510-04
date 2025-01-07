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
exports.getPurchaseHistoryService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const getPurchaseHistoryService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, page, take, }) {
    try {
        const transactions = yield prisma_1.default.transaction.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        title: true,
                        price: true,
                        startTime: true,
                    },
                },
            },
            skip: (page - 1) * take,
            take,
        });
        const totalCount = yield prisma_1.default.transaction.count({
            where: { userId },
        });
        return {
            data: transactions,
            meta: {
                page,
                take,
                total: totalCount,
                totalPages: Math.ceil(totalCount / take),
            },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getPurchaseHistoryService = getPurchaseHistoryService;
