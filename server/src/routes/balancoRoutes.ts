import { Router } from "express";
import * as balancoController from "../controllers/balancoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware ,balancoController.createBalanco);
router.get("/", authMiddleware ,balancoController.listBalancoTotal);


export default router;
