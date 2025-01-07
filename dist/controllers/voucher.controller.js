"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVouchersController = exports.createVoucherController = void 0;
const create_voucher_service_1 = require("../services/voucher/create-voucher.service");
const get_vouchers_service_1 = require("../services/voucher/get-vouchers.service");
const createVoucherController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const result = yield (0, create_voucher_service_1.createVoucherService)(req.body, userId);
        res.status(201).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.createVoucherController = createVoucherController;
const getVouchersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const { page = 1, take = 10 } = req.query;
        const result = yield (0, get_vouchers_service_1.getVouchersService)({
            userId,
            page: Number(page),
            take: Number(take),
        });
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getVouchersController = getVouchersController;
