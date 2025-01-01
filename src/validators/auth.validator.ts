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
    .optional({ nullable: true, checkFalsy: true })
    .trim()
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
      res.status(400).send({ errors: errors.array()[0].msg });
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

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password do not match");
      }
      return true;
    }),
];
