import { z, type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      return res.status(400).json({ error: tree });
    }

    req.body = result.data;
    next();
  };
}
