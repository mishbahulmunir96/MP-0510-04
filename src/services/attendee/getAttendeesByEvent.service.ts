import prisma from "../../lib/prisma";

interface GetAttendeesByEventQuery {
  eventId: number;
  page: number;
  take: number;
}

export const getAttendeesByEventService = async ({
  eventId,
  page,
  take,
}: GetAttendeesByEventQuery) => {
  try {
    const attendees = await prisma.transaction.findMany({
      where: { eventId, status: "done" },
      select: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ticketCount: true,
        amount: true,
      },
      skip: (page - 1) * take,
      take,
    });

    const totalCount = await prisma.transaction.count({
      where: { eventId, status: "done" },
    });

    const attendeesDetail = attendees.map((attendee) => ({
      name: `${attendee.user.firstName} ${attendee.user.lastName}`,
      email: attendee.user.email,
      ticketCount: attendee.ticketCount,
      totalPrice: attendee.amount,
    }));

    return {
      data: attendeesDetail,
      meta: {
        page,
        take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    throw error;
  }
};
