"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateVoucher = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateVoucher = [
    (0, express_validator_1.body)("voucherCode").notEmpty().withMessage("Voucher code is required"),
    (0, express_validator_1.body)("qty").notEmpty().withMessage("Quantity is required"),
    (0, express_validator_1.body)("value").notEmpty().withMessage("Value is required"),
    (0, express_validator_1.body)("expDate").notEmpty().withMessage("Expired date is required"),
    (0, express_validator_1.body)("eventId").notEmpty().withMessage("Event id is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ status: "error", errors: errors.array()[0].msg });
            return;
        }
        next();
    },
];
