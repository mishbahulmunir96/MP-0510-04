import prisma from "../../lib/prisma";
import { cloudinaryUpload } from "../../lib/cloudinary";

interface UploadPaymentProofBody {
  transactionId: number; // ID transaksi yang ingin diupdate
  paymentProof: Express.Multer.File; // Bukti pembayaran yang diupload
}

export const uploadPaymentProofService = async ({
  transactionId,
  paymentProof,
}: UploadPaymentProofBody) => {
  try {
    // Periksa apakah transaksi ada dan dalam status yang valid
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    if (transaction.status === "cancelled") {
      throw new Error("Transaction has been cancelled. Cannot upload proof.");
    }

    // Mengupload file ke Cloudinary
    const { secure_url } = await cloudinaryUpload(paymentProof);

    // Update transaksi dengan URL bukti pembayaran
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: secure_url, // Menyimpan URL bukti pembayaran
        status: "waitingConfirmation", // Mengubah status menjadi 'waitingConfirmation'
      },
    });

    return updatedTransaction; // Mengembalikan transaksi yang telah diperbarui
  } catch (error) {
    throw error;
  }
};