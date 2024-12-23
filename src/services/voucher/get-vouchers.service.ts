import prisma from "../../lib/prisma";

export const getVouchersService = async (userId: number) => {
  try {
    return await prisma.voucher.findMany({
      where: { userId: userId },
      include: { event: true },
    });
  } catch (error) {
    throw error;
  }
};
