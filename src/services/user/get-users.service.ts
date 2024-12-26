import prisma from "../../lib/prisma";

export const getUsersService = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
    });
    return users;
  } catch (error) {
    throw error;
  }
};
