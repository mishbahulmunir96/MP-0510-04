import { Role, User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { prisma } from "../../lib/prisma";

async function generateUniqueReferralCode(): Promise<string> {
  const min = 100000; // Rentang minimum
  const max = 999999; // Rentang maksimum
  let code: string;

  while (true) {
    // Menghasilkan kode acak
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    code = randomNumber.toString(); // Konversi ke string

    // Cek apakah kode referral sudah ada
    const existingCode = await prisma.user.findFirst({
      where: { referralCode: code },
    });

    if (!existingCode) break; // Jika tidak ada, kode unik
  }

  return code; // Kode referral yang unik dalam format string
}

export const registerService = async (body: User) => {
  try {
    const { firstName, lastName, email, phoneNumber, role, password } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exist");
    }

    const referralCode = await generateUniqueReferralCode();
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        role: role ?? Role.USER,
        password: hashedPassword,
        referralCode,
      },
    });
  } catch (error) {
    throw error;
  }
};
