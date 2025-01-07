import prisma from "../../lib/prisma";

interface GetPurchaseHistoryQuery {
  userId: number;
  page: number;
  take: number;
}

export const getPurchaseHistoryService = async ({
  userId,
  page,
  take,
}: GetPurchaseHistoryQuery) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            price: true,
            startTime: true,
          },
        },
      },
      skip: (page - 1) * take,
      take,
    });

    const totalCount = await prisma.transaction.count({
      where: { userId },
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
