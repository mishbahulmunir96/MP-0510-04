import { Request, Response, NextFunction } from "express";
import { getEventsStatisticsService } from "../services/statistic/get-events-statistics.service";

export const getEventsStatisticsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = req.query.year as string | undefined; // Cast query to string
    const month = req.query.month as string | undefined; // Cast query to string
    const day = req.query.day as string | undefined; // Cast query to string

    // Validasi input year, month, day
    if (year && isNaN(Number(year))) {
      res.status(400).json({ message: "Invalid year parameter." });
      return;
    }

    if (
      month &&
      (isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12)
    ) {
      res.status(400).json({ message: "Invalid month parameter." });
      return;
    }

    if (day && (isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31)) {
      res.status(400).json({ message: "Invalid day parameter." });
      return;
    }

    // Validasi tambahan untuk bulan dan hari
    if (month && day) {
      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      if (Number(day) > daysInMonth) {
        res.status(400).json({ message: "Invalid day for the given month." });
        return;
      }
    }

    const userId = res.locals.user.id;
    const statistics = await getEventsStatisticsService({
      userId,
      year,
      month,
      day,
    });

    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
};
