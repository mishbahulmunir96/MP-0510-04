import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import authRouter from "./routes/auth.router";

const app = express();

app.use(cors());
app.use(express.json());

//router, harus diatas middleware error
app.use("/auth", authRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // melihat error di console
  console.log(err);
  res.status(400).send(err.message);
});

app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`);
});
