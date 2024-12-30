import prisma from "../../lib/prisma";

export const gettransactionService = async (id: number) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id },
    });

    if (!transaction) {
      throw new Error("invalid transaction id");
    }
    return transaction;
  } catch (error) {
    throw error;
  }
};
