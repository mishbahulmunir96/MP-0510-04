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
exports.cancelTask = exports.scheduleTask = exports.loadJobs = exports.createTransactionService = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
// Durasi dalam milidetik
const TWO_HOURS = 2 * 60 * 60 * 1000;
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
// Fungsi untuk menjadwalkan tugas
const scheduleTask = (name, date, task) => {
    if (date > new Date()) {
        node_schedule_1.default.scheduleJob(name, date, () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield task();
            }
            catch (error) {
                console.error(`Error in task ${name}:`, error);
            }
        }));
    }
    else {
        console.warn(`Skipped scheduling task ${name} due to past date.`);
    }
};
exports.scheduleTask = scheduleTask;
// Fungsi untuk membatalkan tugas terjadwal
const cancelTask = (name) => {
    const job = node_schedule_1.default.scheduledJobs[name];
    if (job) {
        job.cancel();
    }
    else {
        console.warn(`Task ${name} not found to cancel.`);
    }
};
exports.cancelTask = cancelTask;
// Fungsi untuk rollback transaksi
const rollbackTransaction = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (transaction.voucherId) {
        yield prisma_1.default.voucher.update({
            where: { id: transaction.voucherId },
            data: { usedQty: { decrement: 1 }, qty: { increment: 1 } },
        });
    }
    if (transaction.pointUse) {
        yield prisma_1.default.user.update({
            where: { id: transaction.userId },
            data: { point: { increment: transaction.pointUse } },
        });
    }
    if (transaction.couponId) {
        yield prisma_1.default.coupon.update({
            where: { id: transaction.couponId },
            data: { isUsed: false },
        });
    }
    yield prisma_1.default.event.update({
        where: { id: transaction.eventId },
        data: { availableSeat: { increment: transaction.ticketCount } },
    });
});
// Fungsi untuk menangani transaksi kedaluwarsa
const handleExpiration = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield prisma_1.default.transaction.findUnique({
        where: { id: transactionId },
    });
    if (!transaction || transaction.status !== "waitingPayment") {
        return;
    }
    yield prisma_1.default.transaction.update({
        where: { id: transactionId },
        data: { status: "expired" },
    });
    yield rollbackTransaction(transaction);
});
// Fungsi untuk menangani pembatalan transaksi
const handleCancellation = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield prisma_1.default.transaction.findUnique({
        where: { id: transactionId },
    });
    if (!transaction || transaction.status !== "waitingConfirmation") {
        return;
    }
    yield prisma_1.default.transaction.update({
        where: { id: transactionId },
        data: { status: "cancelled" },
    });
    yield rollbackTransaction(transaction);
});
// Fungsi untuk memuat ulang jadwal dari database
const loadJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const pendingTransactions = yield prisma_1.default.transaction.findMany({
        where: {
            status: { in: ["waitingPayment", "waitingConfirmation"] },
        },
    });
    yield Promise.all(pendingTransactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (transaction.status === "waitingPayment") {
            const expirationDate = new Date(transaction.createdAt.getTime() + TWO_HOURS);
            scheduleTask(`expire-${transaction.id}`, expirationDate, () => __awaiter(void 0, void 0, void 0, function* () {
                yield handleExpiration(transaction.id);
            }));
        }
        if (transaction.status === "waitingConfirmation") {
            const cancellationDate = new Date(transaction.createdAt.getTime() + THREE_DAYS);
            scheduleTask(`cancel-${transaction.id}`, cancellationDate, () => __awaiter(void 0, void 0, void 0, function* () {
                yield handleCancellation(transaction.id);
            }));
        }
    })));
});
exports.loadJobs = loadJobs;
// Fungsi untuk membuat transaksi baru
const createTransactionService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.default.event.findUnique({
            where: { id: body.eventId },
            select: { price: true, availableSeat: true },
        });
        if (!event) {
            throw new Error("Event tidak ditemukan.");
        }
        if (event.availableSeat < body.ticketCount) {
            throw new Error("Jumlah tiket melebihi kapasitas yang tersedia.");
        }
        const pricePerTicket = event.price || 0;
        const totalPrice = pricePerTicket * body.ticketCount;
        let totalDiscount = 0;
        // Validasi Voucher
        if (body.voucherId) {
            const voucher = yield prisma_1.default.voucher.findUnique({
                where: { id: body.voucherId },
                select: { value: true, qty: true, usedQty: true, expDate: true, eventId: true },
            });
            if (!voucher || voucher.qty <= voucher.usedQty || voucher.expDate < new Date() || voucher.eventId !== body.eventId) {
                throw new Error("Voucher tidak valid.");
            }
            totalDiscount += voucher.value;
        }
        // Validasi Kupon
        if (body.couponId) {
            const coupon = yield prisma_1.default.coupon.findUnique({
                where: { id: body.couponId },
                select: { userId: true, isUsed: true, value: true, expiredAt: true },
            });
            if (!coupon || coupon.isUsed || coupon.expiredAt < new Date() || coupon.userId !== body.userId) {
                throw new Error("Kupon tidak valid.");
            }
            totalDiscount += coupon.value;
        }
        // Validasi Poin
        if (body.pointsUse && body.pointsUse > 0) {
            const user = yield prisma_1.default.user.findUnique({
                where: { id: body.userId },
                select: { point: true, pointExpiredDate: true },
            });
            if (!user || user.point < body.pointsUse || !(user.pointExpiredDate instanceof Date) || user.pointExpiredDate < new Date()) {
                throw new Error("Poin tidak mencukupi atau telah kadaluwarsa.");
            }
            totalDiscount += body.pointsUse;
        }
        const finalAmount = totalPrice - totalDiscount;
        if (finalAmount < 0) {
            throw new Error("Harga akhir tidak bisa negatif.");
        }
        const transaction = yield prisma_1.default.transaction.create({
            data: {
                userId: body.userId,
                eventId: body.eventId,
                amount: finalAmount,
                ticketCount: body.ticketCount,
                status: body.paymentProofUploaded ? "waitingConfirmation" : "waitingPayment",
                createdAt: new Date(),
            },
        });
        // Penjadwalan tugas
        const currentDate = new Date();
        if (!body.paymentProofUploaded) {
            const expiryDate = new Date(currentDate.getTime() + TWO_HOURS);
            scheduleTask(`expire-${transaction.id}`, expiryDate, () => __awaiter(void 0, void 0, void 0, function* () {
                yield handleExpiration(transaction.id);
            }));
        }
        else {
            const confirmationExpiryDate = new Date(currentDate.getTime() + THREE_DAYS);
            scheduleTask(`cancel-${transaction.id}`, confirmationExpiryDate, () => __awaiter(void 0, void 0, void 0, function* () {
                yield handleCancellation(transaction.id);
            }));
        }
        return transaction;
    }
    catch (error) {
        console.error("Error in createTransactionService:", error);
        throw error;
    }
});
exports.createTransactionService = createTransactionService;
