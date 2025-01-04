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
      include: {
        voucher: true,
        coupon: true,
        event: true,
        user: true,
      },
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

    // Gunakan transaksi database untuk memastikan semua operasi berhasil atau gagal bersama-sama
    const updatedTransaction = await prisma.$transaction(async (prisma) => {
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: status as Status },
      });

      if (status === "done" || status === "rejected") {
        const user = transaction.user;

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

          transporter
            .sendMail({
              to: user.email,
              subject: "Transaction Status Update",
              html: emailHtml,
            })
            .catch((error) => {
              console.error("Failed to send email:", error);
            });
        }
      }

      if (status === "rejected") {
        if (transaction.voucherId) {
          await prisma.voucher.update({
            where: { id: transaction.voucherId },
            data: {
              usedQty: {
                decrement: 1, // Mengurangi usedQty
              },
              qty: {
                increment: 1, // Mengembalikan kuota voucher
              },
            },
          });
        }

        // rollback point
        if (transaction.pointUse) {
          await prisma.user.update({
            where: { id: transaction.userId },
            data: {
              point: {
                increment: transaction.pointUse,
              },
            },
          });
        }

        // rollback coupon
        if (transaction.couponId) {
          await prisma.coupon.update({
            where: { id: transaction.couponId },
            data: {
              isUsed: false,
            },
          });
        }

        // rollback availableseat
        await prisma.event.update({
          where: { id: transaction.eventId },
          data: {
            availableSeat: {
              increment: transaction.ticketCount,
            },
          },
        });
      }

      return updatedTransaction;
    });

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
