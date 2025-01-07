import { NextFunction, Request, Response } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";
import { getVouchersService } from "../services/voucher/get-vouchers.service";

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

export const getVouchersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const { page = 1, take = 10 } = req.query;

    const result = await getVouchersService({
      userId,
      page: Number(page),
      take: Number(take),
    });

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
