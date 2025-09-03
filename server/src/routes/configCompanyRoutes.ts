import { Router } from "express";
import * as configController from "../controllers/configCompanyController";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,configController.createConfig);
router.get("/", authMiddleware, requireAdmin,  configController.listConfigs);
// router.put("/:id", authMiddleware, requireAdmin, groupController.updateGroup);
// router.delete("/:id", authMiddleware, requireAdmin, groupController.deleteGroup);


export default router;
