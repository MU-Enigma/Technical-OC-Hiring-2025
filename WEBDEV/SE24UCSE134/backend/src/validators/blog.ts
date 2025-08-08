import { z } from "zod";

export const createBlogSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    posted: z.boolean().optional(),
  })
  .strict();

export const updateBlogSchema = z
  .object({
    title: z.string().min(1, "Title must be atleast 1 char").optional(),
    content: z.string().min(1, "content must be atleast 1 char").optional(),
    posted: z.boolean().optional(),
  })
  .strict();
