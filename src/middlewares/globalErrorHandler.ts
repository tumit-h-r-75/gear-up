import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: unknown = err;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.code === "P2002") {
    statusCode = 409;
    message = `Duplicate value for field: ${err.meta?.target}`;
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "Requested record not found";
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({ success: false, message, errorDetails });
};

export default globalErrorHandler;