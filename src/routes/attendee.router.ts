import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { checkUserRole } from "../lib/checkUserRole";
import { getAttendeesByEventController } from "../controllers/attendee.contoller";

const router = Router();

router.get(
  "/:eventId",
  verifyToken,
  checkUserRole,
  getAttendeesByEventController
);

export default router;
