import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/AppError.js";
import { AdminService } from "./admin.service.js";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers();
  sendResponse(res, { statusCode: 200, success: true, message: "All users retrieved.", data: result });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.status || !["ACTIVE", "SUSPENDED"].includes(req.body.status)) {
    throw new AppError(400, "status must be ACTIVE or SUSPENDED");
  }

  const result = await AdminService.updateUserStatus(req.params.id as string, req.body.status);
  sendResponse(res, { statusCode: 200, success: true, message: "User status updated.", data: result });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllGear();
  sendResponse(res, { statusCode: 200, success: true, message: "All gear listings retrieved.", data: result });
});

const getAllRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllRentalOrders();
  sendResponse(res, { statusCode: 200, success: true, message: "All rental orders retrieved.", data: result });
});

export const AdminController = { getAllUsers, updateUserStatus, getAllGear, getAllRentalOrders };