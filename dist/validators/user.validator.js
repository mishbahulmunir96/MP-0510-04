"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUser = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateUser = [
    (0, express_validator_1.body)("firstName")
        .optional()
        .isString()
        .withMessage("First name must be a valid string"),
    (0, express_validator_1.body)("lastName")
        .optional()
        .isString()
        .withMessage("Last name must be a valid string"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .isMobilePhone("id-ID") // Ganti dengan locale yang sesuai
        .withMessage("Invalid phone number format"),
    (0, express_validator_1.body)("gender")
        .optional()
        .isString()
        .isIn(["Male", "Female"])
        .withMessage("Gender must be either 'Male', or 'Female'"),
    (0, express_validator_1.body)("birthDate")
        .optional()
        .isISO8601()
        .withMessage("Birth date must be a valid date in YYYY-MM-DD format"),
    (0, express_validator_1.body)("address")
        .optional()
        .isString()
        .withMessage("Address must be a valid string"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ status: "error", errors: errors.array()[0].msg });
            return;
        }
        next();
    },
];
