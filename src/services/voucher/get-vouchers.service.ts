import prisma from "../../lib/prisma";

interface GetVouchersQuery {
  userId: number;
  page: number;
  take: number;
}

export const getVouchersService = async ({
  userId,
  page,
  take,
}: GetVouchersQuery) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: { userId },
      include: { event: true },
      skip: (page - 1) * take,
      take,
    });

    const totalCount = await prisma.voucher.count({
      where: { userId },
    });

    return {
      data: vouchers,
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
