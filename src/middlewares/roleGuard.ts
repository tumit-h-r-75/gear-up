import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { UserRole } from "../../generated/prisma/enums";


const roleGuard = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!roles.includes(user.role)) {
      throw new AppError(403, "Forbidden");
    }

    next();
  };
};

export default roleGuard;