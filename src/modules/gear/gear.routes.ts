import { Router } from "express";

import { GearController } from "./gear.controller.js";
import auth from "../../middlewares/auth.js";
import roleGuard from "../../middlewares/roleGuard.js";

const router = Router();

router.get("/", GearController.getAllGear);
router.get("/provider/mine", auth, roleGuard("PROVIDER"), GearController.getMyGear);
router.get("/:id", GearController.getGearById);

router.post("/", auth, roleGuard("PROVIDER"), GearController.createGear);
router.patch("/:id", auth, roleGuard("PROVIDER"), GearController.updateGear);
router.delete("/:id", auth, roleGuard("PROVIDER"), GearController.deleteGear);

export default router;