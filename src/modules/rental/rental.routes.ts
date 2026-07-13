import { Router } from "express";

import { RentalController } from "./rental.controller.js";
import auth from "../../middlewares/auth.js";
import roleGuard from "../../middlewares/roleGuard.js";

const router = Router();

router.post("/", auth, roleGuard("CUSTOMER"), RentalController.createRentalOrder);
router.get("/", auth, roleGuard("CUSTOMER"), RentalController.getMyRentalOrders);
router.get("/provider/orders", auth, roleGuard("PROVIDER"), RentalController.getProviderOrders);
router.patch("/provider/orders/:id", auth, roleGuard("PROVIDER"), RentalController.updateOrderStatus);
router.get("/:id", auth, RentalController.getRentalOrderById);

export default router;