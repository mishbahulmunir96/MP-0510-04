import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "../services/transaction/create-transaction.service";

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const paymentProof = files?.paymentProof?.[0];

    const result = await createTransactionService(req.body, paymentProof);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};