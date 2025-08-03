import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1]!;

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (decode as { id: number }).id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};
