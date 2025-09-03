import { Router } from "express";
import * as configControllr from "../controllers/configCompanyController";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,configControllr.createConfig);

// router.get("/", authMiddleware, requireAdmin,  groupController.listGroups);
// router.put("/:id", authMiddleware, requireAdmin, groupController.updateGroup);
// router.delete("/:id", authMiddleware, requireAdmin, groupController.deleteGroup);


export default router;
