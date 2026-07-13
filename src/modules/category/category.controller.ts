import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/AppError.js";
import { CategoryService } from "./category.service.js";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.name || req.body.name.trim().length < 2) {
    throw new AppError(400, "Category name is required and must be at least 2 characters");
  }

  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully.",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategories();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories retrieved successfully.",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.updateCategory(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully.",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfully.",
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};