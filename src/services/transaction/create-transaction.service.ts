import schedule from "node-schedule";
import prisma from "../../lib/prisma";

// Interface untuk body transaksi
interface CreateTransactionBody {
  userId: number;
  eventId: number;
  ticketCount: number;
  voucherId?: number | null; // Opsional
  couponId?: number | null; // Opsional
  pointsUse?: number; // Opsional
  paymentProofUploaded?: boolean; // Menunjukkan apakah bukti pembayaran diunggah
}

// Fungsi untuk menjadwalkan tugas
const scheduleTask = (
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
const cancelTask = (name: string) => {
  const job = schedule.scheduledJobs[name];
  if (job) {
    job.cancel();
    console.log(`Task ${name} dibatalkan`);
  } else {
    console.log(`Task ${name} tidak ditemukan`);
  }
};

// Fungsi untuk memuat ulang jadwal dari database
const loadJobs = async () => {
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
  if (transaction.pointUse) {
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
  if (transaction.pointUse) {
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
        await handleExpiration(transaction.id);
      });
    }

    if (body.paymentProofUploaded) {
      const confirmationExpiryDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 hari
      scheduleTask(`cancel-${transaction.id}`, confirmationExpiryDate, async () => {
        await handleCancellation(transaction.id);
      });
    }

    return transaction;
  } catch (error) {
    throw error;
  }
};

// Ekspor fungsi untuk digunakan di bagian lain
export { loadJobs, scheduleTask, cancelTask };
