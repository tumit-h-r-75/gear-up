import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (id: string, status: "ACTIVE" | "SUSPENDED") => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found");
  return prisma.user.update({ where: { id }, data: { status } });
};

const getAllGear = async () => {
  return prisma.gearItem.findMany({
    include: { provider: { select: { id: true, name: true } }, category: true },
    orderBy: { createdAt: "desc" },
  });
};

const getAllRentalOrders = async () => {
  return prisma.rentalOrder.findMany({
    include: { customer: { select: { id: true, name: true } }, items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
};

export const AdminService = { getAllUsers, updateUserStatus, getAllGear, getAllRentalOrders };