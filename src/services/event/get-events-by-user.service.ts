import prisma from "../../lib/prisma";

export const getEventsByUserService = async (userId: number) => {
  try {
    return await prisma.event.findMany({
      where: { userId: userId },
    });
  } catch (error) {
    throw error;
  }
};
