import { Router } from "express";
import * as groupController from "../controllers/groupCompaniesController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, groupController.createGroup);
router.get("/", authMiddleware, groupController.listGroups);
router.put("/:id", authMiddleware, groupController.updateGroup);
router.delete("/:id", authMiddleware, groupController.deleteGroup);


export default router;
