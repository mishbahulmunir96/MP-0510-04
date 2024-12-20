import { NextFunction, Request, Response } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";

export const createVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const result = await createVoucherService(req.body, userId);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
