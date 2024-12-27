import express from "express";
import {
  createVoucherController,
  getVouchersController,
} from "../controllers/voucher.controller";
import { verifyToken } from "../lib/jwt";
import { validateCreateVoucher } from "../validators/voucher.validator";
import { checkUserRole } from "../lib/checkUserRole";

const router = express.Router();

router.get("/", verifyToken, checkUserRole, getVouchersController);
router.post(
  "/",
  verifyToken,
  checkUserRole,
  validateCreateVoucher,
  createVoucherController
);

export default router;
