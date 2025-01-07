"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTransaction = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateTransaction = [
    (0, express_validator_1.body)("ticketCount")
        .notEmpty()
        .withMessage("Ticket count is required")
        .isNumeric()
        .withMessage("Ticket count must be a number")
        .isInt({ gt: 0 })
        .withMessage("Ticket count must be greater than 0"),
    (0, express_validator_1.body)("voucherId").custom((value) => {
        if (value !== null && !isNaN(Number(value)) && Number(value) > 0) {
            return true; // Jika value adalah angka positif
        }
        if (value === null) {
            return true; // Jika value adalah null
        }
        throw new Error("Voucher ID must be a positive number or null");
    }),
    (0, express_validator_1.body)("couponId").custom((value) => {
        if (value !== null && !isNaN(Number(value)) && Number(value) > 0) {
            return true; // Jika value adalah angka positif
        }
        if (value === null) {
            return true; // Jika value adalah null
        }
        throw new Error("Coupon ID must be a positive number or null");
    }),
    (0, express_validator_1.body)("pointsUse")
        .optional()
        .isNumeric()
        .withMessage("Points to use must be a number"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array() }); // Mengirim semua kesalahan
            return;
        }
        next();
    },
];
