"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const multer_1 = require("../lib/multer");
const fileFilter_1 = require("../lib/fileFilter");
const event_validator_1 = require("../validators/event.validator");
const jwt_1 = require("../lib/jwt");
const checkUserRole_1 = require("../lib/checkUserRole");
const router = (0, express_1.Router)();
router.get("/", event_controller_1.getEventsController);
router.get("/byuser", jwt_1.verifyToken, event_controller_1.getEventsByUserController);
router.get("/:id", event_controller_1.getEventController);
router.post("/create-event", jwt_1.verifyToken, 
// checkUserRole,
(0, multer_1.uploader)().fields([{ name: "thumbnail", maxCount: 1 }]), fileFilter_1.fileFilter, event_validator_1.validateCreateEvent, event_controller_1.createEventController);
router.patch("/update-event/:id", jwt_1.verifyToken, checkUserRole_1.checkUserRole, (0, multer_1.uploader)().single("thumbnail"), fileFilter_1.fileFilter, event_validator_1.validateUpdateEvent, event_controller_1.updateEventController);
exports.default = router;
