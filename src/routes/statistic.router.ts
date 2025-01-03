import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { getEventsStatisticsController } from "../controllers/statistic.controller";
import { checkUserRole } from "../lib/checkUserRole";

const router = Router();

router.get("/", verifyToken, checkUserRole, getEventsStatisticsController);

export default router;
