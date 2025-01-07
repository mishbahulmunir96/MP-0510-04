import express from "express";
import { updateUserController } from "../controllers/user.controller";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { validateUpdateUser } from "../validators/user.validator";

const router = express.Router();

router.patch(
  "/:id",
  verifyToken,
  uploader().single("profilePicture"),
  fileFilter,
  validateUpdateUser,
  updateUserController
);

export default router;
