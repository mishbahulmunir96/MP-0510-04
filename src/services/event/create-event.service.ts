import { cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface CreateEventBody {
  title: string;
  content: string;
  category: string;
  address: string;
  startTime: Date;
  endTime: Date;
  availableSeat: number;
  price: number;
}

export const createEventService = async (
  body: CreateEventBody,
  thumbnail: Express.Multer.File,
  userId: number
) => {
  try {
    const { title, price, availableSeat, endTime, startTime, content, address } = body;

    const event = await prisma.event.findFirst({
      where: { title },
    });

    if (event) {
      throw new Error("Title already in use");
    }

    const { secure_url } = await cloudinaryUpload(thumbnail);

    return await prisma.event.create({
      data: {
        userId: userId,
        price: Number(price),
        availableSeat: Number(availableSeat),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        thumbnail: secure_url,
        title,
        address: body.address,
        category: body.category,
        content: body.content
      },
    });
  } catch (error) {
    throw error;
  }
};
