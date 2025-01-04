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