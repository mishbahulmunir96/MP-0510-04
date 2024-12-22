import { NextFunction, Request, Response } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";
import { getVouchersService } from "../services/voucher/get-vouchers.service";
import { Role } from "@prisma/client";

export const createVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const userId = user.id;
    const userRole = user.role;

    // user role protection, only ORGANIZER can create vocuher
    if (userRole !== Role.ORGANIZER) {
      res.status(403).json({
        status: "error",
        message: "Access denied. Only ORGANIZER can create voucher.",
      });
      return;
    }

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
    const user = res.locals.user;
    const userId = user.id;
    const userRole = user.role;

    // user role protection, only ORGANIZER can get vocuher data
    if (userRole !== Role.ORGANIZER) {
      res.status(403).json({
        status: "error",
        message: "Access denied. Only ORGANIZER can view vouchers.",
      });
      return;
    }

    const result = await getVouchersService(userId);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
