import { NextFunction, Request, Response } from "express";
import { getAttendeesByEventService } from "../services/attendee/getAttendeesByEvent.service";
import prisma from "../lib/prisma";

export const getAttendeesByEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = Number(req.params.eventId);

    if (isNaN(eventId)) {
      throw new Error("Invalid event ID");
    }

    const userId = res.locals.user.id;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true },
    });

    if (!event || event.userId !== userId) {
      throw new Error("Unauthorized access");
    }

    const { page = 1, take = 10 } = req.query;

    const attendees = await getAttendeesByEventService({
      eventId,
      page: Number(page),
      take: Number(take),
    });

    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error in getAttendeesByEventController:", error);
    next(error);
  }
};
