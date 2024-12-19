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
    } = body;

    // Cek jika ada pengguna yang menggunakan email ini
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: id } },
      });

      if (existingUser) {
        throw new Error("Email already in use!");
      }
    }

    // Ambil data pengguna saat ini
    const currentUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    let secureUrl = currentUser.profilePicture || null; // Default jika tidak ada gambar baru

    // Jika ada gambar baru, upload ke Cloudinary
    if (profilePicture) {
      // Hapus gambar sebelumnya jika ada
      if (currentUser.profilePicture) {
        await cloudinaryRemove(currentUser.profilePicture);
      }

      const { secure_url } = await cloudinaryUpload(profilePicture);
      secureUrl = secure_url; // Update URL gambar
    }

    let parsedDate = null;
    if (birthDate) {
      parsedDate = new Date(birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
    }

    // Update data pengguna di database
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
      },
    });
  } catch (error) {
    throw error;
  }
};
