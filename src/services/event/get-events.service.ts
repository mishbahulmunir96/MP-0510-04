import { Prisma } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import prisma from "../../lib/prisma";

interface GetEventQuery extends PaginationQueryParams {
  search: string;
}

export const getEventsService = async (query: GetEventQuery) => {
  try {
    const { page, sortBy, sortOrder, take, search } = query;

    const whereClause: Prisma.EventWhereInput = { deletedAt: null };

    if (search) {
      whereClause.OR = [{ title: { contains: search, mode: "insensitive" } }];
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
    });

    const count = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
