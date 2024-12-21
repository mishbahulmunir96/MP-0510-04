import { User } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { BASE_URL_FRONTEND, JWT_SECRET_FORGOT_PASSWORD } from "../../config";
import { transporter } from "../../lib/nodemailer";
import prisma from "../../lib/prisma";

export const forgotPasswordService = async (body: Pick<User, "email">) => {
  try {
    const { email } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("Email not found");
    }

    const token = sign({ id: user.id }, JWT_SECRET_FORGOT_PASSWORD!, {
      expiresIn: "20m",
    });

    const link = `${BASE_URL_FRONTEND}/reset-password/${token}`;

    transporter.sendMail({
      to: email,
      subject: "Link Reset Password",
      html: `<a href="${link}" target="_blank">${link}</a>`,
    });

    return { message: "Send email success" };
  } catch (error) {
    throw error;
  }
};
