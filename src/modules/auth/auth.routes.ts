import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";

const router = Router();

router.post("/register", AuthController.registerUser);

router.post("/login", AuthController.loginUser);

router.get("/me", auth, AuthController.getMe);

export default router;