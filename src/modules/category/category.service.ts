import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { TCreateCategory, TUpdateCategory } from "./category.interface.js";

const createCategory = async (payload: TCreateCategory) => {
  const existing = await prisma.category.findUnique({ where: { name: payload.name } });
  if (existing) throw new AppError(409, "A category with this name already exists");
  return prisma.category.create({ data: payload });
};

const getCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};

const updateCategory = async (id: string, payload: TUpdateCategory) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError(404, "Category not found");
  return prisma.category.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError(404, "Category not found");
  return prisma.category.delete({ where: { id } });
};

export const CategoryService = { createCategory, getCategories, updateCategory, deleteCategory };