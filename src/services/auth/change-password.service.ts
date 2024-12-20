import { hashPassword } from "../../lib/argon"; 
import prisma from "../../lib/prisma";
import { comparePassword } from "../../lib/argon";

export const changePasswordService = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw new Error("Invalid current password");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return updatedUser;
};
