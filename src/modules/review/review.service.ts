import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { TCreateReview } from "./review.interface.js";

const createReview = async (customerId: string, payload: TCreateReview) => {
  const hasReturnedRental = await prisma.rentalOrderItem.findFirst({
    where: { gearItemId: payload.gearItemId, rentalOrder: { customerId, status: "RETURNED" } },
  });

  if (!hasReturnedRental) {
    throw new AppError(400, "You can only review gear you have rented and returned");
  }

  return prisma.review.create({ data: { ...payload, customerId } });
};

export const ReviewService = { createReview };