import { Router } from "express";
import {
  createEventController,
  getEventController,
  getEventsByOrganizerController,
  getEventsController,
  updateEventController,
} from "../controllers/event.controller";
import { checkUserRole } from "../lib/checkUserRole";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import {
  validateCreateEvent,
  validateUpdateEvent,
} from "../validators/event.validator";

const router = Router();

router.get("/", getEventsController);
router.get(
  "/organizer",
  verifyToken,
  checkUserRole,
  getEventsByOrganizerController
);
router.get("/:id", getEventController);
router.post(
  "/create-event",
  verifyToken,
  checkUserRole,
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
