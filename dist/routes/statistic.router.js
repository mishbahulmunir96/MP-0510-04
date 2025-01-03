"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../lib/jwt");
const statistic_controller_1 = require("../controllers/statistic.controller");
const checkUserRole_1 = require("../lib/checkUserRole");
const router = (0, express_1.Router)();
router.get("/", jwt_1.verifyToken, checkUserRole_1.checkUserRole, statistic_controller_1.getEventsStatisticsController);
exports.default = router;
