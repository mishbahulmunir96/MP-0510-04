"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateForgotPassword = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)("firstName")
        .trim()
        .notEmpty()
        .withMessage("First Name is required")
        .isString()
        .withMessage("First Name must be a valid string"),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone Number is required")
        .isMobilePhone("id-ID")
        .withMessage("Invalid phone number format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ errors: errors.array()[0].msg });
            return;
        }
        next();
    },
];
exports.validateLogin = [
    (0, express_validator_1.body)("email").notEmpty().withMessage("Email is required").isEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0].msg });
            return;
        }
        next();
    },
];
exports.validateForgotPassword = [
    (0, express_validator_1.body)("email").notEmpty().withMessage("Email is required").isEmail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0].msg });
            return;
        }
        next();
    },
];
exports.validateResetPassword = [
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0].msg });
            return;
        }
        next();
    },
];
