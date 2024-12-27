import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { createEventService } from "../services/event/create-event.service";
import { getEventService } from "../services/event/get-event.service";
import { getEventsByUserService } from "../services/event/get-events-by-user.service";
import { getEventsService } from "../services/event/get-events.service";
import { updateEventService } from "../services/event/update-event.service";

export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 3,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const result = await getEventsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getEventsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    const result = await getEventsByUserService(userId);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getEventService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const result = await createEventService(
      req.body,
      files.thumbnail?.[0],
      res.locals.user.id
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thumbnail = req.file as Express.Multer.File;
    const eventId = Number(req.params.id);
    const userId = res.locals.user.id;

    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!currentEvent) {
      res.status(404).json({ status: "error", message: "Event not found." });
      return;
    }

    if (currentEvent.userId !== userId) {
      res.status(403).json({
        status: "error",
        message: "You are not authorized to edit this event.",
      });
      return;
    }

    const result = await updateEventService(eventId, {
      ...req.body,
      thumbnail,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
