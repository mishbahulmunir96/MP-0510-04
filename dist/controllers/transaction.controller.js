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
exports.updateTransactionStatusController = exports.uploadPaymentProofController = exports.getTransactionsByOrganizerController = exports.getTransactionController = exports.createTransactionController = void 0;
const create_transaction_service_1 = require("../services/transaction/create-transaction.service");
const get_transaction_service_1 = require("../services/transaction/get-transaction.service");
const upload_payment_proof_service_1 = require("../services/transaction/upload-payment-proof.service");
const get_transactions_by_organizer_service_1 = require("../services/transaction/get-transactions-by-organizer.service");
const update_transaction_status_service_1 = require("../services/transaction/update-transaction-status.service");
const createTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const transactionData = {
            userId,
            eventId: req.body.eventId,
            ticketCount: req.body.ticketCount,
            voucherId: req.body.voucherId,
            couponId: req.body.couponId,
            pointsToUse: req.body.pointsToUse,
            status: req.body.status,
        };
        const result = yield (0, create_transaction_service_1.createTransactionService)(transactionData);
        res.status(201).send(result);
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
const getTransactionsByOrganizerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const result = yield (0, get_transactions_by_organizer_service_1.getTransactionsByOrganizerService)(userId);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionsByOrganizerController = getTransactionsByOrganizerController;
const uploadPaymentProofController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proofFile = req.file;
        const transactionId = Number(req.params.id);
        if (!proofFile) {
            res.status(400).send("Payment proof is required.");
            return;
        }
        const updatedTransaction = yield (0, upload_payment_proof_service_1.uploadPaymentProofService)({
            transactionId,
            paymentProof: proofFile,
        });
        res.status(200).json(updatedTransaction);
    }
    catch (error) {
        next(error);
    }
});
exports.uploadPaymentProofController = uploadPaymentProofController;
const updateTransactionStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionId = Number(req.params.id);
        const { status, notes } = req.body;
        if (!status) {
            throw new Error("Status is required");
        }
        const updatedTransaction = yield (0, update_transaction_status_service_1.updateTransactionStatusService)(transactionId, status);
        res.status(200).json(updatedTransaction);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTransactionStatusController = updateTransactionStatusController;
