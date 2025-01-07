import prisma from "../../lib/prisma";

export const getEventsByOrganizerService = async (userId: number) => {
  try {
    return await prisma.event.findMany({
      where: { userId: userId },
    });
  } catch (error) {
    throw error;
  }
};
