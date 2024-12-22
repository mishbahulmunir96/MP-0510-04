import prisma from "../../lib/prisma";

export const getUserService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: id, isDeleted: false },
    });

    if (!user) {
      throw new Error(`user id${id} not found`);
    }
    return user;
  } catch (error) {
    throw error;
  }
};
