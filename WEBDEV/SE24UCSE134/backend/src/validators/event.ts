import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z.string().min(1, "Event name is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    date: z.coerce.date({ error: "Invalid date format" }),
    time: z.string().min(1, "Time is required"),
  })
  .strict();

export const updateEventSchema = z
  .object({
    name: z
      .string()
      .min(1, "Event name must be at least 1 character")
      .optional(),
    description: z
      .string()
      .min(1, "Description must be at least 1 character")
      .optional(),
    location: z
      .string()
      .min(1, "Location must be at least 1 character")
      .optional(),
    date: z.coerce.date({ error: "Invalid date format" }).optional(),
    time: z.string().min(1, "Time must be at least 1 character").optional(),
  })
  .strict();
