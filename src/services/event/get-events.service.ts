import { PaginationQueryParams } from "../../types/pagination";
import prisma from "../../lib/prisma";
import { Prisma } from "../../../prisma/generated/client";

interface GetEventQuery extends PaginationQueryParams {
  search?: string;
  category?: string;
  address?: string;
}

export const getEventsService = async (query: GetEventQuery) => {
  try {
    const { page = 1, sortBy, sortOrder = 'asc', take = 10, search, category, address } = query;

    const whereClause: Prisma.EventWhereInput = { deletedAt: null };

    // Add search condition
    if (search) {
      whereClause.OR = [{ title: { contains: search, mode: "insensitive" } }];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add address filter with partial match
    if (address) {
      whereClause.address = { contains: address, mode: "insensitive" };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: sortBy ? { [sortBy]: sortOrder } : undefined, // Sort only if sortBy is provided
    });

    const count = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total: count },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events.");
  }
};
