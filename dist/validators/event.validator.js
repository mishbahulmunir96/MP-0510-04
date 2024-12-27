"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateEvent = exports.validateCreateEvent = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateEvent = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("content").notEmpty().withMessage("Content is required"),
    (0, express_validator_1.body)("category").notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("address").notEmpty().withMessage("address is required"),
    (0, express_validator_1.body)("price").notEmpty().withMessage("price is required"),
    (0, express_validator_1.body)("availableSeat").notEmpty().withMessage("availableSeats is required"),
    (0, express_validator_1.body)("startTime").notEmpty().withMessage("available Seats is required"),
    (0, express_validator_1.body)("endTime").notEmpty().withMessage("endTime is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0].msg });
            return;
        }
        next();
    },
];
exports.validateUpdateEvent = [
    (0, express_validator_1.body)("title").optional().notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("content").optional().notEmpty().withMessage("Content is required"),
    (0, express_validator_1.body)("category").optional().notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("address").optional().notEmpty().withMessage("Address is required"),
    (0, express_validator_1.body)("price").optional().isNumeric().withMessage("Price must be a number"),
    (0, express_validator_1.body)("availableSeat")
        .optional()
        .isNumeric()
        .withMessage("Available seats must be a number"),
    (0, express_validator_1.body)("startTime").optional().notEmpty().withMessage("Start time is required"),
    (0, express_validator_1.body)("endTime").optional().notEmpty().withMessage("End time is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ status: "error", errors: errors.array()[0].msg });
            return;
        }
        next();
    },
];
