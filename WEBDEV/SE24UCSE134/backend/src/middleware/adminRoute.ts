import type { Request, Response, NextFunction } from "express";

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: "Only Admins can perform this action" });
  }
  next();
};