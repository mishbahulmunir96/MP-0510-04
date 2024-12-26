import prisma from "../../lib/prisma";
import { cloudinaryUpload, cloudinaryRemove } from "../../lib/cloudinary";

interface UpdateUserBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: Express.Multer.File;
  gender?: "Male" | "Female";
  birthDate?: string;
  role?: "USER" | "ORGANIZER";
}

export const updateUserService = async (id: number, body: UpdateUserBody) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      profilePicture,
      gender,
      birthDate,
      role,
    } = body;

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: id } },
      });

      if (existingUser) {
        throw new Error("Email already in use!");
      }
    }

    const currentUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    let secureUrl = currentUser.profilePicture || null;
    if (profilePicture) {
      if (currentUser.profilePicture) {
        await cloudinaryRemove(currentUser.profilePicture);
      }

      const { secure_url } = await cloudinaryUpload(profilePicture);
      secureUrl = secure_url;
    }

    let parsedDate = null;
    if (birthDate) {
      parsedDate = new Date(birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
    }

    return await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        profilePicture: secureUrl,
        gender,
        birthDate: parsedDate,
        role,
      },
    });
  } catch (error) {
    throw error;
  }
};
