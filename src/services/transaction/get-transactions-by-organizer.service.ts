import prisma from "../../lib/prisma";

interface GetTransactionsByOrganizerQuery {
  organizerId: number;
  page: number;
  take: number;
}

export const getTransactionsByOrganizerService = async ({
  organizerId,
  page,
  take,
}: GetTransactionsByOrganizerQuery) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        event: {
          userId: organizerId,
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
      skip: (page - 1) * take,
      take,
    });

    const totalCount = await prisma.transaction.count({
      where: {
        event: {
          userId: organizerId,
        },
      },
    });

    return {
      data: transactions,
      meta: {
        page,
        take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    throw error;
  }
};
