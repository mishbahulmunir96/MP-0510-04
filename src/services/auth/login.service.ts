import { comparePassword } from "../../lib/argon";
import { sign } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config";
import prisma from "../../lib/prisma";
import { User } from "../../../prisma/generated/client";

interface Body extends Pick<User, "email" | "password"> {}

export const loginService = async (body: Body) => {
  try {
    const { email, password } = body;

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        referrals: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Invalid email address");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    const { password: pass, ...userWithoutPassword } = user;

    const token = sign({ id: user.id, role: user.role }, JWT_SECRET_KEY!, {
      expiresIn: "2h",
    });

    return { ...userWithoutPassword, token };
  } catch (error) {
    throw error;
  }
};
