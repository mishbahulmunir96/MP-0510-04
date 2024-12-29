import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateTransaction = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("eventId").notEmpty().withMessage("Event ID is required"),
  body("status").notEmpty().withMessage("Status is required"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];