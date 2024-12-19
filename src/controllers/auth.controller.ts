import { NextFunction, Request, Response } from "express";
import { changePasswordService } from "../services/auth/change-password.service";
import { forgotPasswordService } from "../services/auth/forgot-password.service";
import { loginService } from "../services/auth/login.service";
import { registerService } from "../services/auth/register.service";
import { resetPasswordService } from "../services/auth/reset-password.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await forgotPasswordService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const result = await resetPasswordService(userId, req.body.password);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);

    const { currentPassword, newPassword } = req.body;

    const updatedUser = await changePasswordService(
      userId,
      currentPassword,
      newPassword
    );
    res
      .status(200)
      .json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
