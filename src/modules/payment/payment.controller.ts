import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../utils/AppError.js";
import { PaymentService } from "./payment.service.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.rentalOrderId) throw new AppError(400, "rentalOrderId is required");

  const result = await PaymentService.createPaymentSession((req as any).user.id, req.body.rentalOrderId);
  sendResponse(res, { statusCode: 201, success: true, message: "Payment session created successfully.", data: result });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.sessionId) throw new AppError(400, "sessionId is required");

  const result = await PaymentService.confirmPayment(req.body.sessionId);
  sendResponse(res, { statusCode: 200, success: true, message: "Payment status confirmed.", data: result });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPayments((req as any).user.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Payment history retrieved.", data: result });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await PaymentService.getPaymentById(req.params.id as string, user.id, user.role);
  sendResponse(res, { statusCode: 200, success: true, message: "Payment details retrieved.", data: result });
});

export const PaymentController = { createPayment, confirmPayment, getMyPayments, getPaymentById };