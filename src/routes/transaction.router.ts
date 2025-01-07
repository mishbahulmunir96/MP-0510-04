import express from "express";
import {
  createTransactionController,
  getPurchaseHistoryController,
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
  "/organizer",
  verifyToken,
  checkUserRole,
  getTransactionsByOrganizerController
);
router.get("/purchase-history", verifyToken, getPurchaseHistoryController);
router.get("/:id", verifyToken, getTransactionController);
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
router.patch(
  "/update-status/:id",
  verifyToken,
  checkUserRole,
  updateTransactionStatusController
);

export default router;
