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
exports.updateUserService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const cloudinary_1 = require("../../lib/cloudinary");
const updateUserService = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, address, profilePicture, gender, birthDate, } = body;
        if (email) {
            const existingUser = yield prisma_1.default.user.findFirst({
                where: { email, id: { not: id } },
            });
            if (existingUser) {
                throw new Error("Email already in use!");
            }
        }
        const currentUser = yield prisma_1.default.user.findUnique({
            where: { id },
        });
        if (!currentUser) {
            throw new Error("User not found");
        }
        let secureUrl = currentUser.profilePicture || null;
        if (profilePicture) {
            if (currentUser.profilePicture) {
                yield (0, cloudinary_1.cloudinaryRemove)(currentUser.profilePicture);
            }
            const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(profilePicture);
            secureUrl = secure_url;
        }
        let parsedDate = null;
        if (birthDate) {
            parsedDate = new Date(birthDate);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date format");
            }
        }
        return yield prisma_1.default.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                address,
                profilePicture: secureUrl,
                gender,
                birthDate: parsedDate,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updateUserService = updateUserService;
