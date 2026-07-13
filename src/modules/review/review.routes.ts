import { Router } from "express";

import { ReviewController } from "./review.controller.js";
import auth from "../../middlewares/auth.js";
import roleGuard from "../../middlewares/roleGuard.js";

const router = Router();

router.post("/", auth, roleGuard("CUSTOMER"), ReviewController.createReview);

export default router;