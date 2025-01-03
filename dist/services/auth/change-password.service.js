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
exports.changePasswordService = void 0;
const argon_1 = require("../../lib/argon");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const argon_2 = require("../../lib/argon");
const changePasswordService = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user || !(yield (0, argon_2.comparePassword)(currentPassword, user.password))) {
        throw new Error("Invalid current password");
    }
    const hashedNewPassword = yield (0, argon_1.hashPassword)(newPassword);
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });
    return updatedUser;
});
exports.changePasswordService = changePasswordService;
