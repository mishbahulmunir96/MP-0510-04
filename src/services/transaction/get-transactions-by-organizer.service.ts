import prisma from "../../lib/prisma";

export const getTransactionsByOrganizerService = async (
  organizerId: number
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        event: {
          userId: organizerId, // Ambil transaksi yang terkait dengan event yang dimiliki organizer
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    return transactions;
  } catch (error) {
    throw error;
  }
};
