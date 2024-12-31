import { Status, Transaction } from "../../../prisma/generated/client";
import prisma from "../../lib/prisma";
import schedule from 'node-schedule';

interface CreateTransactionBody {
  userId: number;
  eventId: number;
  ticketCount: number;
  voucherId?: number | null; // Opsional
  couponId?: number | null; // Opsional
  pointsToUse?: number; // Opsional
  status: Transaction["status"];
}

export const createTransactionService = async (body: CreateTransactionBody) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: body.eventId },
      select: { price: true },
    });

    if (!event) {
      throw new Error("Event tidak ditemukan");
    }

    const pricePerTicket = event.price || 0;
    const totalPrice = pricePerTicket * body.ticketCount;

    let totalDiscount = 0;

    // Validasi Voucher jika ada
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
        throw new Error("Voucher tidak valid atau sudah terpakai.");
      }

      if (voucher.expDate < new Date()) {
        throw new Error("Voucher kadaluwarsa");
      }

      if (voucher.eventId !== body.eventId) {
        throw new Error("Voucher tidak berlaku untuk event ini.");
      }

      totalDiscount += voucher.value; // Tambahkan diskon dari voucher
    }

    // Validasi Kupon jika ada
    if (body.couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: body.couponId },
        select: { userId: true, isUsed: true, value: true, expiredAt: true },
      });

      if (!coupon || coupon.isUsed) {
        throw new Error("Kupon tidak valid atau sudah digunakan.");
      }

      if (coupon.expiredAt < new Date()) {
        throw new Error("Kupon telah kedaluwarsa.");
      }

      if (coupon.userId !== body.userId) {
        throw new Error("Kupon ini bukan milik Anda.");
      }

      totalDiscount += coupon.value; // Tambahkan nilai kupon ke total diskon
    }

    // Validasi Poin jika ada
    if (body.pointsToUse && body.pointsToUse > 0) {
      const user = await prisma.user.findUnique({
        where: { id: body.userId },
        select: { point: true, pointExpiredDate: true },
      });

      if (!user || user.point < body.pointsToUse) {
        throw new Error("Poin tidak cukup.");
      }

      if (user.pointExpiredDate === null || user.pointExpiredDate < new Date()) {
        throw new Error("Poin telah kadaluwarsa.");
      }

      totalDiscount += body.pointsToUse; // Tambahkan poin yang digunakan ke total diskon
    }

    const finalAmount = totalPrice - totalDiscount;

    if (finalAmount < 0) {
      throw new Error("Harga akhir tidak bisa negatif");
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: body.userId,
        eventId: body.eventId,
        amount: finalAmount,
        ticketCount: body.ticketCount,
        status: body.status,
        createdAt: new Date(), 
      },
    });

    // Update voucher jika digunakan
    if (body.voucherId) {
      await prisma.voucher.update({
        where: { id: body.voucherId },
        data: {
          usedQty: {
            increment: 1,
          },
          qty: {
            decrement: 1,
          },
        },
      });
    }

    // Update poin pengguna jika digunakan
    if (body.pointsToUse) {
      await prisma.user.update({
        where: { id: body.userId },
        data: {
          point: {
            decrement: body.pointsToUse,
          },
        },
      });
    }

    // Update kupon jika digunakan
    if (body.couponId) {
      await prisma.coupon.update({
        where: { id: body.couponId },
        data: {
          isUsed: true,
        },
      });
    }

    // Update availableSeat pada event
    await prisma.event.update({
      where: { id: body.eventId },
      data: {
        availableSeat: {
          decrement: body.ticketCount,
        },
      },
    });

    // Menjadwalkan pembatalan transaksi jika bukti pembayaran tidak diunggah dalam 2 jam
    schedule.scheduleJob(Date.now() + 2 * 60 * 60 * 1000, async () => {
      const transactionToCheck = await prisma.transaction.findUnique({
        where: { id: transaction.id },
      });

      if (transactionToCheck && transactionToCheck.status === 'waitingPayment') {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'cancelled' },
        });
      }
    });

    return transaction;
  } catch (error) {
    throw error;
  }
};
