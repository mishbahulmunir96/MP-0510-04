import { NextFunction, Request, Response } from "express";
import { getEventsService } from "../services/event/get-events.service";

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
  