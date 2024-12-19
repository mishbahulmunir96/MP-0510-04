import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controllers/user.controller";
import { validateUpdateUser } from "../validators/user.validator";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";

const router = express.Router();

router.get("/:id", getUserController);
router.patch(
  "/:id",
  verifyToken,
  uploader().single("profilePicture"),
  fileFilter,
  validateUpdateUser,
  updateUserController
);

export default router;
