import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validateUpdateUser = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a valid string"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a valid string"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("phoneNumber")
    .optional()
    .isMobilePhone("id-ID") // Ganti dengan locale yang sesuai
    .withMessage("Invalid phone number format"),

  body("gender")
    .optional()
    .isString()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be either 'Male', or 'Female'"),

  body("birthDate")
    .optional()
    .isISO8601()
    .withMessage("Birth date must be a valid date in YYYY-MM-DD format"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a valid string"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array()[0].msg });
      return;
    }
    next();
  },
];
