import { Router } from "express";
import { validateLogin, validateRegister } from "../validators/auth.validator";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);

export default router;
