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
    // Mengupload file ke Cloudinary
    const { secure_url } = await cloudinaryUpload(paymentProof);

    // Update transaksi dengan URL bukti pembayaran
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: secure_url, // Menyimpan URL bukti pembayaran
        status: "waitingConfirmation",
      },
    });

    return updatedTransaction; // Mengembalikan transaksi yang telah diperbarui
  } catch (error) {
    throw error;
  }
};
