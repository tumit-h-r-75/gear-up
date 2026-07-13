import { prisma } from "../../lib/prisma.js";
import stripe from "../../lib/stripe.js";
import AppError from "../../utils/AppError.js";
import config from "../../config/index.js";

const createPaymentSession = async (userId: string, rentalOrderId: string) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({ where: { id: rentalOrderId } });
  if (!rentalOrder) throw new AppError(404, "Rental order not found");
  if (rentalOrder.customerId !== userId) throw new AppError(403, "You can only pay for your own order");
  if (rentalOrder.status !== "CONFIRMED") throw new AppError(400, "Order must be CONFIRMED by the provider before payment");

  const existingPayment = await prisma.payment.findUnique({ where: { rentalOrderId } });
  if (existingPayment && existingPayment.status === "COMPLETED") {
    throw new AppError(409, "This order has already been paid");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `GearUp Rental Order #${rentalOrder.id}` },
          unit_amount: Math.round(rentalOrder.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.clientSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: config.clientCancelUrl,
    metadata: { rentalOrderId: rentalOrder.id, userId },
  });

  const payment = await prisma.payment.upsert({
    where: { rentalOrderId },
    update: { transactionId: session.id, amount: rentalOrder.totalAmount, status: "PENDING" },
    create: { transactionId: session.id, rentalOrderId, amount: rentalOrder.totalAmount, status: "PENDING" },
  });

  return { checkoutUrl: session.url, payment };
};

const confirmPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const payment = await prisma.payment.findUnique({ where: { transactionId: sessionId } });
  if (!payment) throw new AppError(404, "Payment record not found");

  if (session.payment_status === "paid") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "COMPLETED", paidAt: new Date() } }),
      prisma.rentalOrder.update({ where: { id: payment.rentalOrderId }, data: { status: "PAID" } }),
    ]);
    return { status: "COMPLETED" };
  }

  await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  return { status: "FAILED" };
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { rentalOrder: { customerId: userId } },
    include: { rentalOrder: true },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({ where: { id }, include: { rentalOrder: true } });
  if (!payment) throw new AppError(404, "Payment not found");
  if (role !== "ADMIN" && payment.rentalOrder.customerId !== userId) {
    throw new AppError(403, "You are not allowed to view this payment");
  }
  return payment;
};

export const PaymentService = { createPaymentSession, confirmPayment, getMyPayments, getPaymentById };