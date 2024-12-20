import express from "express";
import { createVoucherController } from "../controllers/voucher.controller";
import { verifyToken } from "../lib/jwt";
import { validateCreateVoucher } from "../validators/voucher.validator";

const router = express.Router();

router.post("/", verifyToken, validateCreateVoucher, createVoucherController);

export default router;
