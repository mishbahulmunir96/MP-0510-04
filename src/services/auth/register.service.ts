import { Role, User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { prisma } from "../../lib/prisma";
import { generateReferralCode } from "../../lib/generateReferralcode";

export const registerService = async (body: User) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
      referralCode,
    } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exist");
    }

    const hashedPassword = await hashPassword(password);

    const newReferralcode = await generateReferralCode();

    let referredBy = null;
    if (referralCode) {
      const referringUser = await prisma.user.findFirst({
        where: { referralCode },
      });
      if (referringUser) {
        referredBy = referringUser?.id;
      }
    }

    return await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        role: role ?? Role.USER,
        password: hashedPassword,
        referralCode: newReferralcode,
        referredBy,
      },
    });
  } catch (error) {
    throw error;
  }
};
