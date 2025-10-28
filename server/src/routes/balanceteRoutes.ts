import { Router } from "express";
import * as balanceteController from "../controllers/balanceteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,balanceteController.createBalanceteController);
router.patch("/", authMiddleware, balanceteController.listBalancetePerYear)
router.get("/:companyId", authMiddleware, balanceteController.listBalancetesCompany)
router.get('/:companyId/contas', authMiddleware, balanceteController.listContasBalancete);
router.get('/:companyId/:year/:accounting', authMiddleware, balanceteController.listBalanceEspecific);

export default router;
