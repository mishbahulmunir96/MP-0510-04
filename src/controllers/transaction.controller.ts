import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "../services/transaction/create-transaction.service";
import { gettransactionService } from "../services/transaction/get-transaction.service";
import { uploadPaymentProofService } from "../services/transaction/upload-payment-proof.service";
import { getTransactionsByOrganizerService } from "../services/transaction/get-transactions-by-organizer.service";
import { updateTransactionStatusService } from "../services/transaction/update-transaction-status.service";
import { Status } from "../../prisma/generated/client";
import { getPurchaseHistoryService } from "../services/transaction/get-purchase-history.service";

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
      pointsUse: req.body.pointsUse,

      paymentProofUploaded: req.body.paymentProofUploaded || false,
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

export const getTransactionsByOrganizerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerId = res.locals.user.id;
    const { page = 1, take = 10 } = req.query;

    const result = await getTransactionsByOrganizerService({
      organizerId,
      page: Number(page),
      take: Number(take),
    });

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

export const updateTransactionStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = Number(req.params.id);

    const { status, notes } = req.body;
    if (!status) {
      throw new Error("Status is required");
    }

    const updatedTransaction = await updateTransactionStatusService(
      transactionId,
      status
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

export const getPurchaseHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const { page = 1, take = 10 } = req.query;

    const purchaseHistory = await getPurchaseHistoryService({
      userId,
      page: Number(page),
      take: Number(take),
    });

    res.status(200).json(purchaseHistory);
  } catch (error) {
    next(error);
  }
};
