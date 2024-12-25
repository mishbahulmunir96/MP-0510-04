import { NextFunction, Request, Response } from "express";
import { getUserService } from "../services/user/get-user.service";
import { updateUserService } from "../services/user/update-user.service";
import { getUsersService } from "../services/user/get-users.service";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getUsersService();

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const result = await getUserService(id);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

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
