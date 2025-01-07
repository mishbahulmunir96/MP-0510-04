import prisma from "../../lib/prisma";
import { cloudinaryUpload } from "../../lib/cloudinary";

interface UploadPaymentProofBody {
  transactionId: number;
  paymentProof: Express.Multer.File;
}

export const uploadPaymentProofService = async ({
  transactionId,
  paymentProof,
}: UploadPaymentProofBody) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    if (transaction.status === "cancelled") {
      throw new Error("Transaction has been cancelled. Cannot upload proof.");
    }

    const { secure_url } = await cloudinaryUpload(paymentProof);

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: secure_url,
        status: "waitingConfirmation",
      },
    });

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
