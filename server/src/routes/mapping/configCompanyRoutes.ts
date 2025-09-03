import { Router } from "express";
import * as configController from "../../controllers/mapping/configCompanyController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,configController.createConfig);
router.get("/:id", authMiddleware, configController.listConfigCompany);
router.put("/", authMiddleware, configController.updateConfigCompany);

export default router;
