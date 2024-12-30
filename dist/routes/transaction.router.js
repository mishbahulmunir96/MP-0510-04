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
const router = express_1.default.Router();
router.get("/:id", transaction_controller_1.getTransactionController);
router.post("/", jwt_1.verifyToken, transaction_validator_1.validateCreateTransaction, transaction_controller_1.createTransactionController);
router.patch("/:id", jwt_1.verifyToken, (0, multer_1.uploader)().single("paymentProof"), fileFilter_1.fileFilter, transaction_controller_1.uploadPaymentProofController);
exports.default = router;
