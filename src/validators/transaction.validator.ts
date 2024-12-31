import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateTransaction = [
  body("ticketCount")
    .notEmpty()
    .withMessage("Ticket count is required")
    .isNumeric()
    .withMessage("Ticket count must be a number")
    .isInt({ gt: 0 })
    .withMessage("Ticket count must be greater than 0"),

  body("status").notEmpty().withMessage("Status is required"),

  body("voucherId").custom((value) => {
    // Mengizinkan null dan memeriksa untuk angka
    if (value !== null && !isNaN(Number(value))) {
      return true; // Jika value adalah angka
    }
    if (value === null) {
      return true; // Jika value adalah null
    }
    throw new Error("Coupon ID must be a number or null");
  }),

  body("couponId").custom((value) => {
    // Mengizinkan null dan memeriksa untuk angka
    if (value !== null && !isNaN(Number(value))) {
      return true; // Jika value adalah angka
    }
    if (value === null) {
      return true; // Jika value adalah null
    }
    throw new Error("Coupon ID must be a number or null");
  }),

  body("pointsToUse")
    .optional()
    .isNumeric()
    .withMessage("Points to use must be a number"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];