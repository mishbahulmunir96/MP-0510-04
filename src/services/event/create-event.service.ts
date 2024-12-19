import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface CreateEventBody {
  title: string;
  description: string;
  content: string;
  category: string;
  address: string;
  startTime: Date;
  endTime: Date;
  availableSeats: number;
  price: number;
}

export const createEventService = async (
  body: CreateEventBody,
  thumbnail: Express.Multer.File,
  userId: number
) => {
  try {
    const { title } = body;

    const event = await prisma.event.findFirst({
      where: { title },
    });

    if (event) {
      throw new Error("Title already in use");
    }

    const { secure_url } = await cloudinaryUpload(thumbnail);

    return await prisma.event.create({
      data: {
        ...body,
        thumbnail: secure_url,
        userId: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};
