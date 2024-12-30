import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "../services/transaction/create-transaction.service";
import { gettransactionService } from "../services/transaction/get-transaction.service";
import { uploadPaymentProofService } from "../services/transaction/upload-payment-proof.service";

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ambil userId dari req.user yang sudah diverifikasi
    const userId = res.locals.user.id; // Asumsi req.user memiliki properti id

    // Membangun data transaksi menggunakan input dari body permintaan
    const transactionData = {
      userId, // Menggunakan userId dari req.user
      eventId: req.body.eventId,
      ticketCount: req.body.ticketCount,
      voucherId: req.body.voucherId,
      couponId: req.body.couponId,
      pointsToUse: req.body.pointsToUse,
      status: req.body.status,
    };

    const result = await createTransactionService(transactionData);

    res.status(201).send(result); // Status 201 (Created)
  } catch (error) {
    next(error);
  }
};

export const getTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
) => {
  try {
    const proofFile = req.file as Express.Multer.File; // Mendapatkan file bukti pembayaran dari request
    const transactionId = Number(req.params.id); // Mengambil ID transaksi dari parameter URL

    if (!proofFile) {
      res.status(400).send("Payment proof is required."); // Validasi jika tidak ada file yang diupload
      return;
    }

    const updatedTransaction = await uploadPaymentProofService({
      transactionId,
      paymentProof: proofFile,
    });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error); // Menyerahkan error ke middleware pengelola error
  }
};
