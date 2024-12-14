import { Router } from "express";
import {
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "../validators/auth.validator";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { verifyTokenReset } from "../lib/jwt";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post(
  "/forgot-password",
  validateForgotPassword,
  forgotPasswordController
);
router.patch(
  "/reset-password",
  verifyTokenReset,
  validateResetPassword,
  resetPasswordController
);

export default router;
