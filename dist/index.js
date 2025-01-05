"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const event_router_1 = __importDefault(require("./routes/event.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const voucher_router_1 = __importDefault(require("./routes/voucher.router"));
const transaction_router_1 = __importDefault(require("./routes/transaction.router"));
const statistic_router_1 = __importDefault(require("./routes/statistic.router"));
const attendee_router_1 = __importDefault(require("./routes/attendee.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_router_1.default);
app.use("/users", user_router_1.default);
app.use("/events", event_router_1.default);
app.use("/vouchers", voucher_router_1.default);
app.use("/transactions", transaction_router_1.default);
app.use("/statistics", statistic_router_1.default);
app.use("/attendees", attendee_router_1.default);
// middleware error
app.use((err, req, res, next) => {
    // melihat error di console
    console.log(err);
    res.status(400).send(err.message);
});
app.listen(config_1.PORT, () => {
    console.log(`server running on PORT: ${config_1.PORT}`);
});
