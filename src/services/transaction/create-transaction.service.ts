import { Transaction } from "../../../prisma/generated/client";
import { cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface CreateTransactionBody {
  userId: number;
  eventId: number;
  amount: number;
  voucherId: number | null;
  couponId: number | null;
  paymentProof: string;
  ticketCount: number;
  status: Transaction["status"];
}

export const createTransactionService = async (
  body: CreateTransactionBody,
  paymentProof?: Express.Multer.File
) => {
  try {
    let secure_url = null;

    if (paymentProof) {
      secure_url = (await cloudinaryUpload(paymentProof)).secure_url;
    }

    return await prisma.transaction.create({
      data: {
        userId: Number(body.userId),
        eventId: Number(body.eventId),
        amount: Number(body.amount),
        ticketCount:Number(body.ticketCount),
        paymentProof: secure_url,
        status: body.status,


      },
    });
  } catch (error) {
    throw error;
  }
};