"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateEvent = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateEvent = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.body)("content").notEmpty().withMessage("Content is required"),
    (0, express_validator_1.body)("category").notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("address").notEmpty().withMessage("address is required"),
    (0, express_validator_1.body)("price").notEmpty().withMessage("price is required"),
    (0, express_validator_1.body)("availableSeats").notEmpty().withMessage("price is required"),
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
