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
exports.uploadPaymentProofController = exports.getTransactionController = exports.createTransactionController = void 0;
const create_transaction_service_1 = require("../services/transaction/create-transaction.service");
const get_transaction_service_1 = require("../services/transaction/get-transaction.service");
const upload_payment_proof_service_1 = require("../services/transaction/upload-payment-proof.service");
const createTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil userId dari req.user yang sudah diverifikasi
        const userId = res.locals.user.id; // Asumsi req.user memiliki properti id
        // Membangun data transaksi menggunakan input dari body permintaan
        const transactionData = {
            userId, // Menggunakan userId dari req.user
            eventId: req.body.eventId,
            ticketCount: req.body.ticketCount,
            voucherId: req.body.voucherId,
            couponId: req.body.couponId,
            pointsToUse: req.body.pointsToUse,
            status: req.body.status,
        };
        const result = yield (0, create_transaction_service_1.createTransactionService)(transactionData);
        res.status(201).send(result); // Status 201 (Created)
    }
    catch (error) {
        next(error);
    }
});
exports.createTransactionController = createTransactionController;
const getTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield (0, get_transaction_service_1.gettransactionService)(id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionController = getTransactionController;
const uploadPaymentProofController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proofFile = req.file; // Mendapatkan file bukti pembayaran dari request
        const transactionId = Number(req.params.id); // Mengambil ID transaksi dari parameter URL
        if (!proofFile) {
            res.status(400).send("Payment proof is required."); // Validasi jika tidak ada file yang diupload
            return;
        }
        const updatedTransaction = yield (0, upload_payment_proof_service_1.uploadPaymentProofService)({
            transactionId,
            paymentProof: proofFile,
        });
        res.status(200).json(updatedTransaction);
    }
    catch (error) {
        next(error); // Menyerahkan error ke middleware pengelola error
    }
});
exports.uploadPaymentProofController = uploadPaymentProofController;
