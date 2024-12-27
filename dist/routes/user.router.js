"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const fileFilter_1 = require("../lib/fileFilter");
const jwt_1 = require("../lib/jwt");
const multer_1 = require("../lib/multer");
const user_validator_1 = require("../validators/user.validator");
const router = express_1.default.Router();
router.get("/", user_controller_1.getUsersController);
router.get("/:id", user_controller_1.getUserController);
router.patch("/:id", jwt_1.verifyToken, (0, multer_1.uploader)().single("profilePicture"), fileFilter_1.fileFilter, user_validator_1.validateUpdateUser, user_controller_1.updateUserController);
exports.default = router;
