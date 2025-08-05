declare namespace Express {
  interface Request {
    userId?: number;
    isAdmin?: boolean;
  }
}
