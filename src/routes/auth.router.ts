import { Router } from "express";
import { validateRegister } from "../validators/auth.validator";
import { registerController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRegister, registerController);

export default router;
