import { z } from "zod";

const baseSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = baseSchema;

export const registerSchema = baseSchema.extend({
  name: z.string().min(1, "Name is required"),
});