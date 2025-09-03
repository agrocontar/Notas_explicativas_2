import { Router } from "express";
import * as configController from "../../controllers/mapping/configTemplateController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, configController.listConfigTemplate);

export default router;
