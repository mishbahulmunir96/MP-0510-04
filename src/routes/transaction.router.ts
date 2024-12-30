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

router.get("/:id", getTransactionController);
router.post(
  "/",
  verifyToken,
  validateCreateTransaction,
  createTransactionController
);
router.patch(
  "/:id",
  verifyToken,
  uploader().single("paymentProof"),
  fileFilter,
  uploadPaymentProofController
);

export default router;
