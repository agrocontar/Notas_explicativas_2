import { Router } from "express";
import * as balanceteController from "../controllers/balanceteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,balanceteController.createBalancete);

export default router;
