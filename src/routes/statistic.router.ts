import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { getEventsStatisticsController } from "../controllers/statistic.controller";

const router = Router();

router.get("/", verifyToken, getEventsStatisticsController);

export default router;
