import prisma from "../../lib/prisma";

export const getAttendeesByEventService = async (eventId: number) => {
  try {
    const attendees = await prisma.transaction.findMany({
      where: { eventId, status: "done" }, // Hanya transaksi dengan status "done" yang dianggap sebagai attendees
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
    });

    return attendees.map((attendee) => ({
      name: `${attendee.user.firstName} ${attendee.user.lastName}`,
      email: attendee.user.email,
      ticketCount: attendee.ticketCount,
      totalPrice: attendee.amount,
    }));
  } catch (error) {
    throw error;
  }
};
