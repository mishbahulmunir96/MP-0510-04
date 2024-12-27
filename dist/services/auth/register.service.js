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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = void 0;
const date_fns_1 = require("date-fns");
const argon_1 = require("../../lib/argon");
const generateCouponCode_1 = require("../../lib/generateCouponCode");
const generateReferralcode_1 = require("../../lib/generateReferralcode");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const registerService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, role, password, referralCode, } = body;
        const existingUser = yield prisma_1.default.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            throw new Error("Email already exist");
        }
        const hashedPassword = yield (0, argon_1.hashPassword)(password);
        const newReferralcode = yield (0, generateReferralcode_1.generateReferralCode)();
        let referredBy = null;
        if (referralCode) {
            const referringUser = yield prisma_1.default.user.findFirst({
                where: { referralCode },
            });
            if (referringUser) {
                referredBy = referringUser === null || referringUser === void 0 ? void 0 : referringUser.id;
                // point
                yield prisma_1.default.user.update({
                    where: { id: referredBy },
                    data: {
                        point: {
                            increment: 10000,
                        },
                        pointExpiredDate: (0, date_fns_1.addDays)(new Date(), 90),
                    },
                });
            }
        }
        const newUser = yield prisma_1.default.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                password: hashedPassword,
                referralCode: newReferralcode,
                referredBy,
                pointExpiredDate: referredBy ? (0, date_fns_1.addDays)(new Date(), 90) : null,
            },
        });
        if (referredBy) {
            const newCouponcode = yield (0, generateCouponCode_1.generateCouponCode)();
            // coupon
            yield prisma_1.default.coupon.create({
                data: {
                    userId: newUser.id,
                    couponCode: newCouponcode,
                    value: 10,
                    isUsed: false,
                    createdAt: new Date(),
                    expiredAt: (0, date_fns_1.addDays)(new Date(), 90),
                },
            });
        }
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
exports.registerService = registerService;
