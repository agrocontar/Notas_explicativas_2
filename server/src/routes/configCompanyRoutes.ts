import { Router } from "express";
import * as configController from "../controllers/configCompanyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,configController.createConfig);
router.get("/", authMiddleware, configController.listConfigs);
router.get("/:id", authMiddleware, configController.listConfigCompany);
router.put("/", authMiddleware, configController.updateConfigCompany);
// router.put("/:id", authMiddleware, roupController.updateGroup);
// router.delete("/:id", authMiddleware, roupController.deleteGroup);


export default router;
