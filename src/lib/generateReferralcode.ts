import { randomBytes } from "crypto";
import prisma from "./prisma";

export const generateReferralCode = async (): Promise<string> => {
  let code: string;

  while (true) {
    code = randomBytes(4).toString("hex");

    const existingUser = await prisma.user.findFirst({
      where: { referralCode: code },
    });

    if (!existingUser) break;
  }

  return code;
};
