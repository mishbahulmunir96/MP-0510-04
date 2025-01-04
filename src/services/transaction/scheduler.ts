import schedule from "node-schedule";
import prisma from "../../lib/prisma";

// Fungsi untuk menjadwalkan tugas
export const scheduleTask = (
  name: string,
  date: Date,
  task: () => Promise<void>
) => {
  schedule.scheduleJob(name, date, async () => {
    try {
      await task();
      console.log(`Task ${name} selesai pada ${new Date()}`);
    } catch (error) {
      console.error(`Task ${name} gagal:`, error);
    }
  });
};

// Fungsi untuk membatalkan tugas terjadwal
export const cancelTask = (name: string) => {
  const job = schedule.scheduledJobs[name];
  if (job) {
    job.cancel();
    console.log(`Task ${name} dibatalkan`);
  } else {
    console.log(`Task ${name} tidak ditemukan`);
  }
};

// Fungsi untuk memuat ulang jadwal dari database
export const loadJobs = async () => {
  const pendingTransactions = await prisma.transaction.findMany({
    where: {
      status: { in: ["waitingPayment", "waitingConfirmation"] },
    },
  });

  for (const transaction of pendingTransactions) {
    if (transaction.status === "waitingPayment") {
      const expirationDate = new Date(
        transaction.createdAt.getTime() + 1 * 60 * 1000
      );
      if (expirationDate > new Date()) {
        scheduleTask(`expire-${transaction.id}`, expirationDate, async () => {
          await handleExpiration(transaction.id);
        });
      }
    }

    if (transaction.status === "waitingConfirmation") {
      const cancellationDate = new Date(
        transaction.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000
      );
      if (cancellationDate > new Date()) {
        scheduleTask(`cancel-${transaction.id}`, cancellationDate, async () => {
          await handleCancellation(transaction.id);
        });
      }
    }
  }
};

// Fungsi untuk menangani transaksi kedaluwarsa
const handleExpiration = async (transactionId: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.status !== "waitingPayment") {
    console.log(`Transaksi ${transactionId} sudah diproses.`);
    return;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "expired" },
  });

  // Rollback availableSeat pada event
  await prisma.event.update({
    where: { id: transaction.eventId },
    data: { availableSeat: { increment: transaction.ticketCount } },
  });

  // Rollback voucher jika digunakan
  if (transaction.voucherId) {
    await prisma.voucher.update({
      where: { id: transaction.voucherId },
      data: {
        usedQty: { decrement: 1 },
        qty: { increment: 1 },
      },
    });
  }

  // Rollback poin jika digunakan
  if (transaction.pointUse) { // Perbaikan di sini
    await prisma.user.update({
      where: { id: transaction.userId },
      data: { point: { increment: transaction.pointUse } },
    });
  }

  // Rollback kupon jika digunakan
  if (transaction.couponId) {
    await prisma.coupon.update({
      where: { id: transaction.couponId },
      data: { isUsed: false },
    });
  }

  console.log(`Transaksi ${transactionId} diubah menjadi expired.`);
};

// Fungsi untuk menangani pembatalan transaksi
const handleCancellation = async (transactionId: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.status !== "waitingConfirmation") {
    console.log(`Transaksi ${transactionId} sudah diproses.`);
    return;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "cancelled" },
  });

  // Rollback availableSeat pada event
  await prisma.event.update({
    where: { id: transaction.eventId },
    data: { availableSeat: { increment: transaction.ticketCount } },
  });

  // Rollback voucher jika digunakan
  if (transaction.voucherId) {
    await prisma.voucher.update({
      where: { id: transaction.voucherId },
      data: {
        usedQty: { decrement: 1 },
        qty: { increment: 1 },
      },
    });
  }

  // Rollback poin jika digunakan
  if (transaction.pointUse) { // Perbaikan di sini
    await prisma.user.update({
      where: { id: transaction.userId },
      data: { point: { increment: transaction.pointUse } },
    });
  }

  // Rollback kupon jika digunakan
  if (transaction.couponId) {
    await prisma.coupon.update({
      where: { id: transaction.couponId },
      data: { isUsed: false },
    });
  }

  console.log(`Transaksi ${transactionId} diubah menjadi cancelled.`);
};
