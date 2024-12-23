import express from "express";
import {
  createVoucherController,
  getVouchersController,
} from "../controllers/voucher.controller";
import { verifyToken } from "../lib/jwt";
import { validateCreateVoucher } from "../validators/voucher.validator";
import { checkUserRole } from "../lib/checkUserRole";

const router = express.Router();

router.get("/", verifyToken, checkUserRole, getVouchersController); // harus login (verify token) dulu utk get voucher agar user yg tk punya hak tdk bisa lihat voucher code
router.post(
  "/",
  verifyToken,
  checkUserRole,
  validateCreateVoucher,
  createVoucherController
);

export default router;
