import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/AppError.js";
import { ReviewService } from "./review.service.js";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { gearItemId, rating } = req.body;
  if (!gearItemId) throw new AppError(400, "gearItemId is required");
  if (rating === undefined || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(400, "rating is required and must be an integer between 1 and 5");
  }

  const result = await ReviewService.createReview((req as any).user.id, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Review submitted successfully.", data: result });
});

export const ReviewController = { createReview };