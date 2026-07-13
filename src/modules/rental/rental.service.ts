import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { TCreateRental, TRentalStatus } from "./rental.interface.js";

const createRentalOrder = async (customerId: string, payload: TCreateRental) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new AppError(400, "Invalid startDate or endDate");
  if (endDate <= startDate) throw new AppError(400, "endDate must be after startDate");

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const gearIds = payload.items.map((i) => i.gearItemId);
  const gearItems = await prisma.gearItem.findMany({ where: { id: { in: gearIds } } });
  if (gearItems.length !== gearIds.length) throw new AppError(404, "One or more gear items not found");

  let totalAmount = 0;
  const orderItemsData = payload.items.map((item) => {
    const gear = gearItems.find((g) => g.id === item.gearItemId)!;
    const quantity = item.quantity ?? 1;
    if (gear.stock < quantity) throw new AppError(400, `Not enough stock for "${gear.name}"`);
    const price = gear.pricePerDay * quantity * days;
    totalAmount += price;
    return { gearItemId: gear.id, quantity, price };
  });

  return prisma.rentalOrder.create({
    data: { customerId, startDate, endDate, totalAmount, items: { create: orderItemsData } },
    include: { items: { include: { gearItem: true } } },
  });
};

const getMyRentalOrders = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { customerId },
    include: { items: { include: { gearItem: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });
};

const getRentalOrderById = async (id: string, userId: string, role: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id },
    include: { items: { include: { gearItem: true } }, payment: true, customer: { select: { id: true, name: true, email: true } } },
  });
  if (!order) throw new AppError(404, "Rental order not found");

  const isOwner = order.customerId === userId;
  const isProvider = order.items.some((i) => i.gearItem.providerId === userId);
  if (role !== "ADMIN" && !isOwner && !isProvider) throw new AppError(403, "You are not allowed to view this order");

  return order;
};

const getProviderOrders = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { items: { some: { gearItem: { providerId } } } },
    include: { items: { include: { gearItem: true } }, customer: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const updateOrderStatus = async (providerId: string, orderId: string, status: TRentalStatus) => {
  const order = await prisma.rentalOrder.findUnique({ where: { id: orderId }, include: { items: { include: { gearItem: true } } } });
  if (!order) throw new AppError(404, "Rental order not found");

  const isProvider = order.items.some((i) => i.gearItem.providerId === providerId);
  if (!isProvider) throw new AppError(403, "You do not manage any item in this order");

  return prisma.rentalOrder.update({ where: { id: orderId }, data: { status } });
};

export const RentalService = { createRentalOrder, getMyRentalOrders, getRentalOrderById, getProviderOrders, updateOrderStatus };