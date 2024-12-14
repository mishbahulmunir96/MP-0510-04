import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is required")
    .isString()
    .withMessage("First Name must be a valid string"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone Number is required")
    .isMobilePhone("id-ID")
    .withMessage("Invalid phone number format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
      return;
    }

    next();
  },
];

export const validateLogin = [
  body("email").notEmpty().withMessage("Email is required").isEmail(),
  body("password").notEmpty().withMessage("Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateForgotPassword = [
  body("email").notEmpty().withMessage("Email is required").isEmail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateResetPassword = [
  body("password").notEmpty().withMessage("Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
