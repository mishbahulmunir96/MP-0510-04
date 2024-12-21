import { Voucher } from "../../../prisma/generated/client";
import prisma from "../../lib/prisma";

export const createVoucherService = async (body: Voucher, userId: number) => {
  try {
    const existingVoucher = await prisma.voucher.findFirst({
      where: {
        voucherCode: body.voucherCode,
      },
    });

    if (existingVoucher) {
      throw new Error("Voucher Code is Already exist");
    }

    const newData = await prisma.voucher.create({
      data: {
        voucherCode: body.voucherCode,
        qty: body.qty,
        value: body.value,
        expDate: new Date(body.expDate),
        userId: userId,
      },
    });

    return newData;
  } catch (error) {
    throw error;
  }
};
