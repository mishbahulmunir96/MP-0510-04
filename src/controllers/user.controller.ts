import { NextFunction, Request, Response } from "express";
import { getUserService } from "../services/user/get-user.service";
import { updateUserService } from "../services/user/update-user.service";

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
    const profilePicture = req.file as Express.Multer.File; // Mengambil file gambar
    const userId = res.locals.user.id; // Mengambil id pengguna dari token

    const result = await updateUserService(userId, {
      ...req.body,
      profilePicture, // Mengirimkan gambar yang di-upload
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
