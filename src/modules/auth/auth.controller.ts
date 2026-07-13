import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

import { AuthService } from "./auth.service.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully.",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful.",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const result = await AuthService.getMe(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully.",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
};