import { addDays } from "date-fns";
import { User } from "../../../prisma/generated/client";
import { hashPassword } from "../../lib/argon";
import { generateCouponCode } from "../../lib/generateCouponCode";
import { generateReferralCode } from "../../lib/generateReferralcode";
import prisma from "../../lib/prisma";

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

      if (!referringUser) {
        throw new Error("Invalid referral code");
      }

      referredBy = referringUser?.id;

      await prisma.user.update({
        where: { id: referredBy },
        data: {
          point: {
            increment: 10000,
          },
          pointExpiredDate: addDays(new Date(), 90),
        },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        password: hashedPassword,
        referralCode: newReferralcode,
        referredBy,
      },
    });

    if (referredBy) {
      const newCouponcode = await generateCouponCode();

      // coupon
      await prisma.coupon.create({
        data: {
          userId: newUser.id,
          couponCode: newCouponcode,
          value: 10000,
          isUsed: false,
          createdAt: new Date(),
          expiredAt: addDays(new Date(), 90),
        },
      });
    }

    return newUser;
  } catch (error) {
    throw error;
  }
};
