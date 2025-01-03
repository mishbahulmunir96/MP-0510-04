"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const fileFilter_1 = require("../lib/fileFilter");
const jwt_1 = require("../lib/jwt");
const multer_1 = require("../lib/multer");
const transaction_validator_1 = require("../validators/transaction.validator");
const checkUserRole_1 = require("../lib/checkUserRole");
const router = express_1.default.Router();
router.get("/byorg", jwt_1.verifyToken, checkUserRole_1.checkUserRole, transaction_controller_1.getTransactionsByOrganizerController);
router.get("/:id", jwt_1.verifyToken, transaction_controller_1.getTransactionController);
router.post("/", jwt_1.verifyToken, transaction_validator_1.validateCreateTransaction, // Validasi input untuk membuat transaksi
transaction_controller_1.createTransactionController);
// Mengunggah bukti pembayaran untuk transaksi tertentu
router.patch("/:id", jwt_1.verifyToken, (0, multer_1.uploader)().single("paymentProof"), // Menggunakan multer untuk mengunggah file
fileFilter_1.fileFilter, // Memfilter file yang diunggah
transaction_controller_1.uploadPaymentProofController);
router.patch("/update-status/:id", jwt_1.verifyToken, checkUserRole_1.checkUserRole, transaction_controller_1.updateTransactionStatusController);
exports.default = router;
