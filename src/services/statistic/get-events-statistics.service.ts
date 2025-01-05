import prisma from "../../lib/prisma";

interface EventStatisticsParams {
  userId: number;
  year?: string;
  month?: string;
  day?: string;
}

export const getEventsStatisticsService = async ({
  userId,
  year,
  month,
  day,
}: EventStatisticsParams) => {
  try {
    const filters: any = {
      eventId: {
        in: await prisma.event
          .findMany({ where: { userId }, select: { id: true } })
          .then((events) => events.map((event) => event.id)),
      },
    };

    if (year) {
      filters.createdAt = {
        gte: new Date(`${year}-01-01`), // Mulai dari awal tahun
        lt: new Date(`${Number(year) + 1}-01-01`), // Sampai awal tahun berikutnya
      };
    }

    if (month) {
      filters.createdAt = {
        gte: new Date(`${year}-${month}-01`), // Mulai dari awal bulan
        lt:
          month === "12"
            ? new Date(`${Number(year) + 1}-01-01`)
            : new Date(`${year}-${Number(month) + 1}-01`), // Sampai awal bulan berikutnya
      };
    }

    if (day) {
      filters.createdAt = {
        gte: new Date(`${year}-${month}-${day}`), // Tanggal tertentu
        lt: new Date(`${year}-${month}-${Number(day) + 1}`), // Hari berikutnya
      };
    }

    const statistics = await prisma.transaction.groupBy({
      by: ["eventId"],
      _count: { id: true },
      _sum: { amount: true, ticketCount: true }, // Tambahkan agregasi untuk total pendapatan dan tiket
      where: filters,
    });

    // Mengambil title dari event berdasarkan eventId
    const events = await prisma.event.findMany({
      where: { id: { in: statistics.map((stat) => stat.eventId) } },
      select: { id: true, title: true, startTime: true },
    });

    // Format hasil untuk lebih informatif
    const formattedStatistics = statistics.map((stat) => {
      const event = events.find((e) => e.id === stat.eventId);
      return {
        eventId: stat.eventId,
        title: event?.title || "Unknown Event", // Menyertakan title
        startTime: event?.startTime || "Unknown Time", // Menyertakan startTime
        totalTransactions: stat._count.id,
        totalRevenue: stat._sum.amount || 0,
        totalTicketsSold: stat._sum.ticketCount || 0,
      };
    });

    return formattedStatistics;
  } catch (error) {
    throw error;
  }
};
