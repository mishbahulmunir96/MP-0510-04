import { Router } from "express";
import { createEventController, getEventController, getEventsController } from "../controllers/event.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { validateCreateEvent } from "../validators/event.validator";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", getEventsController);
router.get("/:id", getEventController);
router.post(
    "/create-event",
    verifyToken,
    uploader().fields([{ name: "thumbnail", maxCount: 1 }]),
    fileFilter,
    validateCreateEvent,
    createEventController
  )

export default router;

