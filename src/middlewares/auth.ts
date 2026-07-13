import { NextFunction, Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import config from "../config/index.js";

import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError(401, "You are not authorized.");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Invalid token.");
    }

    const decoded = verifyToken(token, config.jwtAccessSecret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (user.status === "SUSPENDED") {
      throw new AppError(403, "Your account has been suspended.");
    }

    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;