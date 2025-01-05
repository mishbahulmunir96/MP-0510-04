"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../lib/jwt");
const checkUserRole_1 = require("../lib/checkUserRole");
const attendee_contoller_1 = require("../controllers/attendee.contoller");
const router = (0, express_1.Router)();
router.get("/:eventId", jwt_1.verifyToken, checkUserRole_1.checkUserRole, attendee_contoller_1.getAttendeesByEventController);
exports.default = router;
