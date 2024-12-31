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
exports.updateTransactionStatusService = void 0;
const client_1 = require("../../../prisma/generated/client");
const nodemailer_1 = require("../../lib/nodemailer");
const notificationTrxEmail_1 = require("../../lib/notificationTrxEmail");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const updateTransactionStatusService = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.default.transaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        const validStatuses = [
            client_1.Status.done,
            client_1.Status.rejected,
            client_1.Status.waitingPayment,
            client_1.Status.waitingConfirmation,
            client_1.Status.expired,
            client_1.Status.cancelled,
        ];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}. Valid statuses are: ${validStatuses.join(", ")}`);
        }
        const updatedTransaction = yield prisma_1.default.transaction.update({
            where: { id: transactionId },
            data: { status: status },
        });
        // Kirim email jika status berubah menjadi "done" atau "rejected"
        if (status === "done" || status === "rejected") {
            const user = yield prisma_1.default.user.findUnique({
                where: { id: transaction.userId }, // Ganti dengan field yang sesuai di model Transaction
            });
            if (user && user.email) {
                const emailHtml = (0, notificationTrxEmail_1.notificationTrxEmail)({
                    userName: `${user.firstName} ${user.lastName}`,
                    transactionID: transaction.id.toString(),
                    amount: transaction.amount.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                    }),
                    date: new Date(transaction.createdAt).toLocaleDateString("id-ID"),
                    status: status,
                });
                nodemailer_1.transporter.sendMail({
                    to: user.email,
                    subject: "Transaction Status Update",
                    html: emailHtml,
                });
            }
        }
        return updatedTransaction;
    }
    catch (error) {
        throw error;
    }
});
exports.updateTransactionStatusService = updateTransactionStatusService;
