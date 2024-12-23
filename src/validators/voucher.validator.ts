import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validateCreateVoucher = [
  body("voucherCode").notEmpty().withMessage("Voucher code is required"),
  body("qty").notEmpty().withMessage("Quantity is required"),
  body("value").notEmpty().withMessage("Value is required"),
  body("expDate").notEmpty().withMessage("Expired date is required"),
  body("eventId").notEmpty().withMessage("Event id is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array()[0].msg });
      return;
    }
    next();
  },
];
