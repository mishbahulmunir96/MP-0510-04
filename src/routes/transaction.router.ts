import express from "express";
import {
  createTransactionController,
  getTransactionController,
  uploadPaymentProofController,
} from "../controllers/transaction.controller";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { validateCreateTransaction } from "../validators/transaction.validator";

const router = express.Router();

// Mendapatkan transaksi berdasarkan ID
router.get("/:id", verifyToken, getTransactionController);

// Membuat transaksi baru
router.post(
  "/",
  verifyToken,
  validateCreateTransaction, // Validasi input untuk membuat transaksi
  createTransactionController
);

// Mengunggah bukti pembayaran untuk transaksi tertentu
router.patch(
  "/:id",
  verifyToken,
  uploader().single("paymentProof"), // Menggunakan multer untuk mengunggah file
  fileFilter, // Memfilter file yang diunggah
  uploadPaymentProofController
);

export default router;