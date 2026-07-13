import { Router } from "express";

import { AdminController } from "./admin.controller.js";
import auth from "../../middlewares/auth.js";
import roleGuard from "../../middlewares/roleGuard.js";

const router = Router();

router.get("/users", auth, roleGuard("ADMIN"), AdminController.getAllUsers);
router.patch("/users/:id", auth, roleGuard("ADMIN"), AdminController.updateUserStatus);
router.get("/gears", auth, roleGuard("ADMIN"), AdminController.getAllGear);
router.get("/rentals", auth, roleGuard("ADMIN"), AdminController.getAllRentalOrders);

export default router;