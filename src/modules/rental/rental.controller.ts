import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/AppError.js";
import { RentalService } from "./rental.service.js";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate, items } = req.body;
  if (!startDate || !endDate) throw new AppError(400, "startDate and endDate are required");
  if (!Array.isArray(items) || items.length === 0) throw new AppError(400, "At least one gear item is required");

  const result = await RentalService.createRentalOrder((req as any).user.id, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Rental order placed successfully.", data: result });
});

const getMyRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getMyRentalOrders((req as any).user.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Your rental orders retrieved.", data: result });
});

const getRentalOrderById = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await RentalService.getRentalOrderById(req.params.id as string, user.id, user.role);
  sendResponse(res, { statusCode: 200, success: true, message: "Rental order retrieved.", data: result });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getProviderOrders((req as any).user.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Incoming orders retrieved.", data: result });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const allowed = ["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"];
  if (!req.body.status || !allowed.includes(req.body.status)) {
    throw new AppError(400, `status must be one of: ${allowed.join(", ")}`);
  }

  const result = await RentalService.updateOrderStatus((req as any).user.id, req.params.id as string, req.body.status);
  sendResponse(res, { statusCode: 200, success: true, message: "Order status updated.", data: result });
});

export const RentalController = { createRentalOrder, getMyRentalOrders, getRentalOrderById, getProviderOrders, updateOrderStatus };