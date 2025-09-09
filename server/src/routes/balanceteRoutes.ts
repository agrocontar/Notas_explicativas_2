import { Router } from "express";
import * as balanceteController from "../controllers/balanceteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,balanceteController.createBalancete);
router.patch("/", authMiddleware, balanceteController.listBalancetePerYear)
router.get("/:companyId", authMiddleware, balanceteController.listBalancetesCompany)

export default router;
