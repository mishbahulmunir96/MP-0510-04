import prisma from "../../lib/prisma";
import { scheduleTask } from "./scheduler";

interface CreateTransactionBody {
  userId: number;
  eventId: number;
  ticketCount: number;
  voucherId?: number | null; // Opsional
  couponId?: number | null; // Opsional
  pointsUse?: number; // Opsional
  paymentProofUploaded?: boolean; // Menunjukkan apakah bukti pembayaran diunggah
}

export const createTransactionService = async (body: CreateTransactionBody) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: body.eventId },
      select: { price: true, availableSeat: true },
    });

    if (!event) {
      throw new Error("Event tidak ditemukan.");
    }

    if (event.availableSeat < body.ticketCount) {
      throw new Error("Jumlah tiket melebihi kapasitas yang tersedia.");
    }

    const pricePerTicket = event.price || 0;
    const totalPrice = pricePerTicket * body.ticketCount;
    let totalDiscount = 0;

    // Validasi Voucher
    if (body.voucherId) {
      const voucher = await prisma.voucher.findUnique({
        where: { id: body.voucherId },
        select: {
          value: true,
          qty: true,
          usedQty: true,
          expDate: true,
          eventId: true,
        },
      });

      if (!voucher || voucher.qty <= voucher.usedQty) {
        throw new Error("Voucher tidak valid atau sudah digunakan.");
      }

      if (voucher.expDate < new Date()) {
        throw new Error("Voucher kadaluwarsa.");
      }

      if (voucher.eventId !== body.eventId) {
        throw new Error("Voucher tidak berlaku untuk event ini.");
      }

      totalDiscount += voucher.value;
    }

    // Validasi Kupon
    if (body.couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: body.couponId },
        select: { userId: true, isUsed: true, value: true, expiredAt: true },
      });

      if (!coupon || coupon.isUsed) {
        throw new Error("Kupon tidak valid atau sudah digunakan.");
      }

      if (coupon.expiredAt < new Date()) {
        throw new Error("Kupon kadaluwarsa.");
      }

      if (coupon.userId !== body.userId) {
        throw new Error("Kupon ini bukan milik Anda.");
      }

      totalDiscount += coupon.value;
    }

    // Validasi Poin
    if (body.pointsUse && body.pointsUse > 0) {
      const user = await prisma.user.findUnique({
        where: { id: body.userId },
        select: { point: true, pointExpiredDate: true },
      });

      if (!user || user.point < body.pointsUse) {
        throw new Error("Poin tidak mencukupi.");
      }

      if (!user.pointExpiredDate || user.pointExpiredDate < new Date()) {
        throw new Error("Poin telah kadaluwarsa.");
      }

      totalDiscount += body.pointsUse;
    }

    const finalAmount = totalPrice - totalDiscount;

    if (finalAmount < 0) {
      throw new Error("Harga akhir tidak bisa negatif.");
    }

    // Buat transaksi baru
    const transaction = await prisma.transaction.create({
      data: {
        userId: body.userId,
        eventId: body.eventId,
        amount: finalAmount,
        ticketCount: body.ticketCount,
        status: body.paymentProofUploaded ? "waitingConfirmation" : "waitingPayment",
        createdAt: new Date(),
      },
    });

    // Cek apakah transaksi sudah kadaluwarsa sebelum mengizinkan upload bukti pembayaran
    if (body.paymentProofUploaded) {
      const currentDate = new Date();
      const expiryDate = new Date(transaction.createdAt.getTime() + 1 * 60 * 1000); // 2 jam setelah transaksi dibuat

      if (currentDate > expiryDate) {
        throw new Error("Transaksi sudah kadaluwarsa, tidak dapat mengunggah bukti pembayaran.");
      }

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "waitingConfirmation" },
      });
    }

    // Update voucher, poin, dan kupon jika digunakan
    if (body.voucherId) {
      await prisma.voucher.update({
        where: { id: body.voucherId },
        data: { usedQty: { increment: 1 }, qty: { decrement: 1 } },
      });
    }

    if (body.pointsUse) {
      await prisma.user.update({
        where: { id: body.userId },
        data: { point: { decrement: body.pointsUse } },
      });
    }

    if (body.couponId) {
      await prisma.coupon.update({
        where: { id: body.couponId },
        data: { isUsed: true },
      });
    }

    // Update kapasitas event
    await prisma.event.update({
      where: { id: body.eventId },
      data: { availableSeat: { decrement: body.ticketCount } },
    });

    // Penjadwalan tugas pembatalan dan kedaluwarsa
    const currentDate = new Date();
    if (!body.paymentProofUploaded) {
      const expiryDate = new Date(currentDate.getTime() + 1 * 60 * 1000); // 2 jam
      scheduleTask(`expire-${transaction.id}`, expiryDate, async () => {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "expired" },
        });

        await prisma.event.update({
          where: { id: body.eventId },
          data: { availableSeat: { increment: body.ticketCount } },
        });
      });
    }

    if (body.paymentProofUploaded) {
      const confirmationExpiryDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 hari
      scheduleTask(`cancel-${transaction.id}`, confirmationExpiryDate, async () => {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "cancelled" },
        });

        await prisma.event.update({
          where: { id: body.eventId },
          data: { availableSeat: { increment: body.ticketCount } },
        });
      });
    }

    return transaction;
  } catch (error) {
    throw error;
  }
};
