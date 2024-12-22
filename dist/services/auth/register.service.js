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
exports.registerService = void 0;
const client_1 = require("@prisma/client");
const argon_1 = require("../../lib/argon");
const prisma_1 = require("../../lib/prisma");
function generateUniqueReferralCode() {
    return __awaiter(this, void 0, void 0, function* () {
        const min = 100000; // Rentang minimum
        const max = 999999; // Rentang maksimum
        let code;
        while (true) {
            // Menghasilkan kode acak
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            code = randomNumber.toString(); // Konversi ke string
            // Cek apakah kode referral sudah ada
            const existingCode = yield prisma_1.prisma.user.findFirst({
                where: { referralCode: code },
            });
            if (!existingCode)
                break; // Jika tidak ada, kode unik
        }
        return code; // Kode referral yang unik dalam format string
    });
}
const registerService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, role, password } = body;
        const existingUser = yield prisma_1.prisma.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            throw new Error("Email already exist");
        }
        const referralCode = yield generateUniqueReferralCode();
        const hashedPassword = yield (0, argon_1.hashPassword)(password);
        return yield prisma_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                role: role !== null && role !== void 0 ? role : client_1.Role.USER,
                password: hashedPassword,
                referralCode,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
exports.registerService = registerService;
