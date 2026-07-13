import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import gearRoutes from "../modules/gear/gear.routes.js";
import rentalRoutes from "../modules/rental/rental.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
import reviewRoutes from "../modules/review/review.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories",categoryRoutes)
router.use("/gear",gearRoutes)
router.use("/rentals",rentalRoutes)
router.use("/payments",paymentRoutes)
router.use("/reviews",reviewRoutes)
router.use("/admin",adminRoutes)
export default router;