import { NextFunction, Request, Response } from "express";
import { getEventsService } from "../services/event/get-events.service";
import { createEventService } from "../services/event/create-event.service";
import { getEventService } from "../services/event/get-event.service";
import { getEventsByUserService } from "../services/event/get-events-by-user.service";
import { Role } from "../../prisma/generated/client";

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
    const user = res.locals.user;
    const userId = user.id;
    const userRole = user.role;

    // user role protection, only ORGANIZER can get vocuher data
    if (userRole !== Role.ORGANIZER) {
      res.status(403).json({
        status: "error",
        message: "Access denied. Only ORGANIZER can view their events.",
      });
      return;
    }

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
