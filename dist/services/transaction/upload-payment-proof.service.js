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
exports.uploadPaymentProofService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const cloudinary_1 = require("../../lib/cloudinary");
const uploadPaymentProofService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactionId, paymentProof, }) {
    try {
        // Mengupload file ke Cloudinary
        const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(paymentProof);
        // Update transaksi dengan URL bukti pembayaran
        const updatedTransaction = yield prisma_1.default.transaction.update({
            where: { id: transactionId },
            data: {
                paymentProof: secure_url, // Menyimpan URL bukti pembayaran
                status: "waitingConfirmation",
            },
        });
        return updatedTransaction; // Mengembalikan transaksi yang telah diperbarui
    }
    catch (error) {
        throw error;
    }
});
exports.uploadPaymentProofService = uploadPaymentProofService;