"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = void 0;
const checkUserRole = (req, res, next) => {
    const user = res.locals.user;
    if (user && user.role === "ORGANIZER") {
        return next();
    }
    res.status(403).json({
        status: "error",
        message: "Access denied. Only organizers can do this action.",
    });
};
exports.checkUserRole = checkUserRole;
