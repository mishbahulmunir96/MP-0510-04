"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const jwt_1 = require("../lib/jwt");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
router.post("/register", auth_validator_1.validateRegister, auth_controller_1.registerController);
router.post("/login", auth_validator_1.validateLogin, auth_controller_1.loginController);
router.post("/forgot-password", auth_validator_1.validateForgotPassword, auth_controller_1.forgotPasswordController);
router.patch("/reset-password", jwt_1.verifyTokenReset, auth_validator_1.validateResetPassword, auth_controller_1.resetPasswordController);
router.patch("/change-password", jwt_1.verifyToken, auth_validator_1.validateChangePassword, auth_controller_1.changePasswordController);

exports.default = router;
