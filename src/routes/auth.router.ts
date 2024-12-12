import { Router } from "express";
import {
  validateForgotPassword,
  validateLogin,
  validateRegister,
} from "../validators/auth.validator";
import {
  forgotPasswordController,
  loginController,
  registerController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post(
  "/forgot-password",
  validateForgotPassword,
  forgotPasswordController
);

export default router;
