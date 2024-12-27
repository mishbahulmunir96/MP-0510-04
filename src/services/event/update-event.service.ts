import { cloudinaryUpload, cloudinaryRemove } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface UpdateEventBody {
  title?: string;
  content?: string;
  category?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  availableSeat?: number;
  price?: number;
  thumbnail?: Express.Multer.File;
}

export const updateEventService = async (
  eventId: number,
  body: UpdateEventBody
) => {
  try {
    const {
      title,
      content,
      category,
      address,
      startTime,
      endTime,
      availableSeat,
      price,
      thumbnail,
    } = body;

    if (title) {
      const existingEvent = await prisma.event.findFirst({
        where: { title, id: { not: eventId } },
      });

      if (existingEvent) {
        throw new Error("Event title already in use");
      }
    }

    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!currentEvent) {
      throw new Error("Event not found");
    }

    let thumbnailUrl = currentEvent.thumbnail;
    if (thumbnail) {
      if (currentEvent.thumbnail) {
        await cloudinaryRemove(currentEvent.thumbnail);
      }
      const { secure_url } = await cloudinaryUpload(thumbnail);
      thumbnailUrl = secure_url;
    }

    return await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title || currentEvent.title,
        content: content || currentEvent.content,
        category: category || currentEvent.category,
        address: address || currentEvent.address,
        price: price !== undefined ? Number(price) : currentEvent.price,
        availableSeat:
          availableSeat !== undefined
            ? Number(availableSeat)
            : currentEvent.availableSeat,
        startTime: startTime ? new Date(startTime) : currentEvent.startTime,
        endTime: endTime ? new Date(endTime) : currentEvent.endTime,
        thumbnail: thumbnailUrl,
      },
    });
  } catch (error) {
    throw error;
  }
};
