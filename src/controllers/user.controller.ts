import { NextFunction, Request, Response } from "express";
import { updateUserService } from "../services/user/update-user.service";

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profilePicture = req.file as Express.Multer.File;
    const userId = res.locals.user.id;

    const result = await updateUserService(userId, {
      ...req.body,
      profilePicture,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
