import express from "express";
import {
  createTransactionController,
} from "../controllers/transaction.controller";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { validateCreateTransaction } from "../validators/transaction.validator";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  uploader().fields([{ name: "paymentProof", maxCount: 1 }]),
  fileFilter,
  validateCreateTransaction,
  createTransactionController
);

export default router;
