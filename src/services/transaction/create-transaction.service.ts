import schedule from "node-schedule";
import prisma from "../../lib/prisma";

// Durasi dalam milidetik
const TWO_HOURS = 2 * 60 * 60 * 1000; 
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

// Interface untuk body transaksi
interface CreateTransactionBody {
  userId: number;
  eventId: number;
  ticketCount: number;
  voucherId?: number | null;
  couponId?: number | null;
  pointsUse?: number;
  paymentProofUploaded?: boolean;
}

// Fungsi untuk menjadwalkan tugas
const scheduleTask = (name: string, date: Date, task: () => Promise<void>) => {
  if (date > new Date()) {
    schedule.scheduleJob(name, date, async () => {
      try {
        await task();
      } catch (error) {
        console.error(`Error in task ${name}:`, error);
      }
    });
  } else {
    console.warn(`Skipped scheduling task ${name} due to past date.`);
  }
};

// Fungsi untuk membatalkan tugas terjadwal
const cancelTask = (name: string) => {
  const job = schedule.scheduledJobs[name];
  if (job) {
    job.cancel();
  } else {
    console.warn(`Task ${name} not found to cancel.`);
  }
};

// Fungsi untuk rollback transaksi
const rollbackTransaction = async (transaction: any) => {
  if (transaction.voucherId) {
    await prisma.voucher.update({
      where: { id: transaction.voucherId },
      data: { usedQty: { decrement: 1 }, qty: { increment: 1 } },
    });
  }
  if (transaction.pointUse) {
    await prisma.user.update({
      where: { id: transaction.userId },
      data: { point: { increment: transaction.pointUse } },
    });
  }
  if (transaction.couponId) {
    await prisma.coupon.update({
      where: { id: transaction.couponId },
      data: { isUsed: false },
    });
  }
  await prisma.event.update({
    where: { id: transaction.eventId },
    data: { availableSeat: { increment: transaction.ticketCount } },
  });
};

// Fungsi untuk menangani transaksi kedaluwarsa
const handleExpiration = async (transactionId: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.status !== "waitingPayment") {
    return;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "expired" },
  });

  await rollbackTransaction(transaction);
};

// Fungsi untuk menangani pembatalan transaksi
const handleCancellation = async (transactionId: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.status !== "waitingConfirmation") {
    return;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "cancelled" },
  });

  await rollbackTransaction(transaction);
};

// Fungsi untuk memuat ulang jadwal dari database
const loadJobs = async () => {
  const pendingTransactions = await prisma.transaction.findMany({
    where: {
      status: { in: ["waitingPayment", "waitingConfirmation"] },
    },
  });

  await Promise.all(
    pendingTransactions.map(async (transaction) => {
      if (transaction.status === "waitingPayment") {
        const expirationDate = new Date(transaction.createdAt.getTime() + TWO_HOURS);
        scheduleTask(`expire-${transaction.id}`, expirationDate, async () => {
          await handleExpiration(transaction.id);
        });
      }

      if (transaction.status === "waitingConfirmation") {
        const cancellationDate = new Date(transaction.createdAt.getTime() + THREE_DAYS);
        scheduleTask(`cancel-${transaction.id}`, cancellationDate, async () => {
          await handleCancellation(transaction.id);
        });
      }
    })
  );
};

// Fungsi untuk membuat transaksi baru
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
        select: { value: true, qty: true, usedQty: true, expDate: true, eventId: true },
      });

      if (!voucher || voucher.qty <= voucher.usedQty || voucher.expDate < new Date() || voucher.eventId !== body.eventId) {
        throw new Error("Voucher tidak valid.");
      }

      totalDiscount += voucher.value;
    }

    // Validasi Kupon
    if (body.couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: body.couponId },
        select: { userId: true, isUsed: true, value: true, expiredAt: true },
      });

      if (!coupon || coupon.isUsed || coupon.expiredAt < new Date() || coupon.userId !== body.userId) {
        throw new Error("Kupon tidak valid.");
      }

      totalDiscount += coupon.value;
    }

    // Validasi Poin
    if (body.pointsUse && body.pointsUse > 0) {
      const user = await prisma.user.findUnique({
        where: { id: body.userId },
        select: { point: true, pointExpiredDate: true },
      });

      if (!user || user.point < body.pointsUse || !(user.pointExpiredDate instanceof Date) || user.pointExpiredDate < new Date()) {
        throw new Error("Poin tidak mencukupi atau telah kadaluwarsa.");
      }

      totalDiscount += body.pointsUse;
    }

    const finalAmount = totalPrice - totalDiscount;
    if (finalAmount < 0) {
      throw new Error("Harga akhir tidak bisa negatif.");
    }

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

    // Penjadwalan tugas
    const currentDate = new Date();
    if (!body.paymentProofUploaded) {
      const expiryDate = new Date(currentDate.getTime() + TWO_HOURS);
      scheduleTask(`expire-${transaction.id}`, expiryDate, async () => {
        await handleExpiration(transaction.id);
      });
    } else {
      const confirmationExpiryDate = new Date(currentDate.getTime() + THREE_DAYS);
      scheduleTask(`cancel-${transaction.id}`, confirmationExpiryDate, async () => {
        await handleCancellation(transaction.id);
      });
    }

    return transaction;
  } catch (error) {
    console.error("Error in createTransactionService:", error);
    throw error;
  }
};

// Ekspor fungsi untuk digunakan di bagian lain
export { loadJobs, scheduleTask, cancelTask };
