import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { TCreateGear, TUpdateGear, TGearQuery } from "./gear.interface.js";

const getAllGear = async (query: TGearQuery) => {
  const { category, brand, minPrice, maxPrice, search } = query;

  return prisma.gearItem.findMany({
    where: {
      isAvailable: true,
      ...(category && { categoryId: category }),
      ...(brand && { brand: { equals: brand, mode: "insensitive" } }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(minPrice || maxPrice
        ? { pricePerDay: { ...(minPrice && { gte: Number(minPrice) }), ...(maxPrice && { lte: Number(maxPrice) }) } }
        : {}),
    },
    include: { category: true, provider: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getGearById = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: { category: true, provider: { select: { id: true, name: true } }, reviews: true },
  });
  if (!gear) throw new AppError(404, "Gear item not found");
  return gear;
};

const createGear = async (providerId: string, payload: TCreateGear) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new AppError(404, "Category not found");
  return prisma.gearItem.create({ data: { ...payload, providerId } });
};

const updateGear = async (providerId: string, gearId: string, payload: TUpdateGear) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
  if (!gear) throw new AppError(404, "Gear item not found");
  if (gear.providerId !== providerId) throw new AppError(403, "You can only update your own gear");
  return prisma.gearItem.update({ where: { id: gearId }, data: payload });
};

const deleteGear = async (providerId: string, gearId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
  if (!gear) throw new AppError(404, "Gear item not found");
  if (gear.providerId !== providerId) throw new AppError(403, "You can only delete your own gear");
  return prisma.gearItem.delete({ where: { id: gearId } });
};

const getMyGear = async (providerId: string) => {
  return prisma.gearItem.findMany({ where: { providerId }, include: { category: true } });
};

export const GearService = { getAllGear, getGearById, createGear, updateGear, deleteGear, getMyGear };