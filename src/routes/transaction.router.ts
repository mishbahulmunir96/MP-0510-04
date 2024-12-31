import express from "express";
import {
  createTransactionController,
  getTransactionController,
  getTransactionsByOrganizerController,
  updateTransactionStatusController,
  uploadPaymentProofController,
} from "../controllers/transaction.controller";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { validateCreateTransaction } from "../validators/transaction.validator";
import { checkUserRole } from "../lib/checkUserRole";

const router = express.Router();

router.get(
  "/byorg",
  verifyToken,
  checkUserRole,
  getTransactionsByOrganizerController
);

router.get("/:id", verifyToken, getTransactionController);

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
router.patch(
  "/update-status/:id",
  verifyToken,
  checkUserRole,
  updateTransactionStatusController
);

export default router;