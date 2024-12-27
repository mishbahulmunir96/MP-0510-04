import { Router } from "express";
import {
  createEventController,
  getEventController,
  getEventsByUserController,
  getEventsController,
  updateEventController,
} from "../controllers/event.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import {
  validateCreateEvent,
  validateUpdateEvent,
} from "../validators/event.validator";
import { verifyToken } from "../lib/jwt";
import { checkUserRole } from "../lib/checkUserRole";

const router = Router();

router.get("/", getEventsController);
router.get("/byuser", verifyToken, getEventsByUserController);
router.get("/:id", getEventController);
router.post(
  "/create-event",
  verifyToken,
  // checkUserRole,
  uploader().fields([{ name: "thumbnail", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);
router.patch(
  "/update-event/:id",
  verifyToken,
  checkUserRole,
  uploader().single("thumbnail"),
  fileFilter,
  validateUpdateEvent,
  updateEventController
);

export default router;
