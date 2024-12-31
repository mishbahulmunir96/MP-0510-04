import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "../services/transaction/create-transaction.service";
import { gettransactionService } from "../services/transaction/get-transaction.service";
import { uploadPaymentProofService } from "../services/transaction/upload-payment-proof.service";
import { Status } from "../../prisma/generated/client";

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.id;

    const transactionData = {
      userId,
      eventId: req.body.eventId,
      ticketCount: req.body.ticketCount,
      voucherId: req.body.voucherId,
      couponId: req.body.couponId,
      pointsToUse: req.body.pointsToUse,
      status: Status.waitingPayment,
      
    };

    const result = await createTransactionService(transactionData);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const getTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await gettransactionService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const uploadPaymentProofController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const proofFile = req.file as Express.Multer.File;
    const transactionId = Number(req.params.id);

    if (!proofFile) {
      res.status(400).send("Payment proof is required.");
      return;
    }

    const updatedTransaction = await uploadPaymentProofService({
      transactionId,
      paymentProof: proofFile,
    });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};
