import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import authRouter from "./routes/auth.router";
import eventRouter from "./routes/event.router";
import userRouter from "./routes/user.router";
import voucherRouter from "./routes/voucher.router";
import transactionRouter from "./routes/transaction.router";
import statisticRouter from "./routes/statistic.router";
import attendeesRouter from "./routes/attendee.router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/vouchers", voucherRouter);
app.use("/transactions", transactionRouter);
app.use("/statistics", statisticRouter);
app.use("/attendees", attendeesRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // melihat error di console
  console.log(err);
  res.status(400).send(err.message);
});

app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`);
});
