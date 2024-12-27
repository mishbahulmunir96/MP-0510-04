"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voucher_controller_1 = require("../controllers/voucher.controller");
const jwt_1 = require("../lib/jwt");
const voucher_validator_1 = require("../validators/voucher.validator");
const checkUserRole_1 = require("../lib/checkUserRole");
const router = express_1.default.Router();
router.get("/", jwt_1.verifyToken, checkUserRole_1.checkUserRole, voucher_controller_1.getVouchersController);
router.post("/", jwt_1.verifyToken, checkUserRole_1.checkUserRole, voucher_validator_1.validateCreateVoucher, voucher_controller_1.createVoucherController);
exports.default = router;
