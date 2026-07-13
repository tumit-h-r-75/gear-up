import { Router } from "express";

import { PaymentController } from "./payment.controller.js";
import auth from "../../middlewares/auth.js";
import roleGuard from "../../middlewares/roleGuard.js";

const router = Router();

router.post("/create", auth, roleGuard("CUSTOMER"), PaymentController.createPayment);
router.post("/confirm", auth, roleGuard("CUSTOMER"), PaymentController.confirmPayment);
router.get("/", auth, roleGuard("CUSTOMER"), PaymentController.getMyPayments);
router.get("/:id", auth, PaymentController.getPaymentById);

export default router;