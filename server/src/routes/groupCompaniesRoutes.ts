import { Router } from "express";
import * as groupController from "../controllers/groupCompaniesController";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, requireAdmin ,groupController.createGroup);
router.get("/", authMiddleware, requireAdmin,  groupController.listGroups);
router.put("/:id", authMiddleware, requireAdmin, groupController.updateGroup);
router.delete("/:id", authMiddleware, requireAdmin, groupController.deleteGroup);


export default router;
