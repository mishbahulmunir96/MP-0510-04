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
exports.createVoucherService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const createVoucherService = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingVoucher = yield prisma_1.default.voucher.findFirst({
            where: {
                voucherCode: body.voucherCode,
            },
        });
        if (existingVoucher) {
            throw new Error("Voucher Code is Already exist");
        }
        const newData = yield prisma_1.default.voucher.create({
            data: {
                voucherCode: body.voucherCode,
                qty: body.qty,
                value: body.value,
                expDate: new Date(body.expDate),
                userId: userId,
                eventId: body.eventId,
            },
        });
        return newData;
    }
    catch (error) {
        throw error;
    }
});
exports.createVoucherService = createVoucherService;
