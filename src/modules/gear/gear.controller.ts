import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/AppError.js";
import { GearService } from "./gear.service.js";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getAllGear(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Gear retrieved successfully.",
    data: result,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getGearById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Gear details retrieved.",
    data: result,
  });
});

const createGear = catchAsync(async (req: Request, res: Response) => {
  const { name, description, pricePerDay, categoryId } = req.body;
  if (!name || name.trim().length < 2)
    throw new AppError(400, "Name is required (min 2 characters)");
  if (!description || description.trim().length < 10)
    throw new AppError(400, "Description is required (min 10 characters)");
  if (pricePerDay === undefined || Number(pricePerDay) <= 0)
    throw new AppError(400, "A valid pricePerDay greater than 0 is required");
  if (!categoryId) throw new AppError(400, "categoryId is required");
//   console.log("req.user:", (req as any).user);
  const result = await GearService.createGear((req as any).user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Gear added successfully.",
    data: result,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.updateGear(
    (req as any).user.id,
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Gear updated successfully.",
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  await GearService.deleteGear((req as any).user.id, req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Gear deleted successfully.",
  });
});

const getMyGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getMyGear((req as any).user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your gear listings retrieved.",
    data: result,
  });
});

export const GearController = {
  getAllGear,
  getGearById,
  createGear,
  updateGear,
  deleteGear,
  getMyGear,
};
