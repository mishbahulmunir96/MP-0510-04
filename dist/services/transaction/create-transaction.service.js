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
exports.createTransactionService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const createTransactionService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.default.event.findUnique({
            where: { id: body.eventId },
            select: { price: true },
        });
        if (!event) {
            throw new Error("Event tidak ditemukan");
        }
        const pricePerTicket = event.price || 0;
        const totalPrice = pricePerTicket * body.ticketCount;
        let totalDiscount = 0;
        // Validasi Voucher jika ada
        if (body.voucherId) {
            const voucher = yield prisma_1.default.voucher.findUnique({
                where: { id: body.voucherId },
                select: {
                    value: true,
                    qty: true,
                    usedQty: true,
                    expDate: true,
                    eventId: true,
                },
            });
            if (!voucher || voucher.qty <= voucher.usedQty) {
                throw new Error("Voucher tidak valid atau sudah terpakai.");
            }
            if (voucher.expDate < new Date()) {
                throw new Error("Voucher kadaluwarsa");
            }
            if (voucher.eventId !== body.eventId) {
                throw new Error("Voucher tidak berlaku untuk event ini.");
            }
            totalDiscount += voucher.value; // Tambahkan diskon dari voucher
        }
        // Validasi Kupon jika ada
        if (body.couponId) {
            const coupon = yield prisma_1.default.coupon.findUnique({
                where: { id: body.couponId },
                select: { userId: true, isUsed: true, value: true, expiredAt: true },
            });
            if (!coupon || coupon.isUsed) {
                throw new Error("Kupon tidak valid atau sudah digunakan.");
            }
            if (coupon.expiredAt < new Date()) {
                throw new Error("Kupon telah kedaluwarsa.");
            }
            if (coupon.userId !== body.userId) {
                throw new Error("Kupon ini bukan milik Anda.");
            }
            totalDiscount += coupon.value; // Tambahkan nilai kupon ke total diskon
        }
        // Validasi Poin jika ada
        if (body.pointsToUse && body.pointsToUse > 0) {
            const user = yield prisma_1.default.user.findUnique({
                where: { id: body.userId },
                select: { point: true, pointExpiredDate: true },
            });
            if (!user || user.point < body.pointsToUse) {
                throw new Error("Poin tidak cukup.");
            }
            if (user.pointExpiredDate === null || user.pointExpiredDate < new Date()) {
                throw new Error("Poin telah kadaluwarsa.");
            }
            totalDiscount += body.pointsToUse; // Tambahkan poin yang digunakan ke total diskon
        }
        const finalAmount = totalPrice - totalDiscount;
        if (finalAmount < 0) {
            throw new Error("Harga akhir tidak bisa negatif");
        }
        const transaction = yield prisma_1.default.transaction.create({
            data: {
                userId: body.userId,
                eventId: body.eventId,
                amount: finalAmount,
                ticketCount: body.ticketCount,
                status: body.status,
                createdAt: new Date(),
            },
        });
        // Update voucher jika digunakan
        if (body.voucherId) {
            yield prisma_1.default.voucher.update({
                where: { id: body.voucherId },
                data: {
                    usedQty: {
                        increment: 1,
                    },
                    qty: {
                        decrement: 1,
                    },
                },
            });
        }
        // Update poin pengguna jika digunakan
        if (body.pointsToUse) {
            yield prisma_1.default.user.update({
                where: { id: body.userId },
                data: {
                    point: {
                        decrement: body.pointsToUse,
                    },
                },
            });
        }
        // Update kupon jika digunakan
        if (body.couponId) {
            yield prisma_1.default.coupon.update({
                where: { id: body.couponId },
                data: {
                    isUsed: true,
                },
            });
        }
        // Update availableSeat pada event
        yield prisma_1.default.event.update({
            where: { id: body.eventId },
            data: {
                availableSeat: {
                    decrement: body.ticketCount,
                },
            },
        });
        // Menjadwalkan pembatalan transaksi jika bukti pembayaran tidak diunggah dalam 2 jam
        node_schedule_1.default.scheduleJob(Date.now() + 2 * 60 * 60 * 1000, () => __awaiter(void 0, void 0, void 0, function* () {
            const transactionToCheck = yield prisma_1.default.transaction.findUnique({
                where: { id: transaction.id },
            });
            if (transactionToCheck && transactionToCheck.status === 'waitingPayment') {
                yield prisma_1.default.transaction.update({
                    where: { id: transaction.id },
                    data: { status: 'cancelled' },
                });
            }
        }));
        return transaction;
    }
    catch (error) {
        throw error;
    }
});
exports.createTransactionService = createTransactionService;
