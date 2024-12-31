import { Status } from "../../../prisma/generated/client";
import { transporter } from "../../lib/nodemailer";
import { notificationTrxEmail } from "../../lib/notificationTrxEmail";
import prisma from "../../lib/prisma";

export const updateTransactionStatusService = async (
  transactionId: number,
  status: string
) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const validStatuses = [
      Status.done,
      Status.rejected,
      Status.waitingPayment,
      Status.waitingConfirmation,
      Status.expired,
      Status.cancelled,
    ];
    if (!validStatuses.includes(status as Status)) {
      throw new Error(
        `Invalid status: ${status}. Valid statuses are: ${validStatuses.join(
          ", "
        )}`
      );
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: status as Status },
    });

    // Kirim email jika status berubah menjadi "done" atau "rejected"
    if (status === "done" || status === "rejected") {
      const user = await prisma.user.findUnique({
        where: { id: transaction.userId }, // Ganti dengan field yang sesuai di model Transaction
      });

      if (user && user.email) {
        const emailHtml = notificationTrxEmail({
          userName: `${user.firstName} ${user.lastName}`,
          transactionID: transaction.id.toString(),
          amount: transaction.amount.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }),
          date: new Date(transaction.createdAt).toLocaleDateString("id-ID"),
          status: status,
        });

        transporter.sendMail({
          to: user.email,
          subject: "Transaction Status Update",
          html: emailHtml,
        });
      }
    }

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
