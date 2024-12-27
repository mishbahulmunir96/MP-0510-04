import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateEvent = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("address").notEmpty().withMessage("address is required"),
  body("price").notEmpty().withMessage("price is required"),
  body("availableSeat").notEmpty().withMessage("availableSeats is required"),
  body("startTime").notEmpty().withMessage("available Seats is required"),
  body("endTime").notEmpty().withMessage("endTime is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

// export const validateUpdateEvent = [
//   body("title").optional().notEmpty().withMessage("Title is required"),
//   body("description")
//     .optional()
//     .notEmpty()
//     .withMessage("Description is required"),
//   body("content").optional().notEmpty().withMessage("Content is required"),
//   body("category").optional().notEmpty().withMessage("Category is required"),
//   body("address").optional().notEmpty().withMessage("Address is required"),
//   body("price").optional().isNumeric().withMessage("Price must be a number"),
//   body("availableSeat")
//     .optional()
//     .isNumeric()
//     .withMessage("Available seats must be a number"),
//   body("startTime").optional().notEmpty().withMessage("Start time is required"),
//   body("endTime").optional().notEmpty().withMessage("End time is required"),

//   (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(400).json({ status: "error", errors: errors.array()[0].msg });
//       return;
//     }
//     next();
//   },
// ];
