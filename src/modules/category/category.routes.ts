import { Router } from "express";

import { CategoryController } from "./category.controller.js";
import auth from "../../middlewares/auth.js";
import roleGuard from "../../middlewares/roleGuard.js";

const router = Router();

router.post("/", auth, roleGuard("ADMIN"), CategoryController.createCategory);

router.get("/", CategoryController.getCategories);

router.patch("/:id", auth, roleGuard("ADMIN"), CategoryController.updateCategory);

router.delete("/:id", auth, roleGuard("ADMIN"), CategoryController.deleteCategory);

export default router;