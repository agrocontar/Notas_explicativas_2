import { Router } from "express";
import * as notasController from "../controllers/notasController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router()

router.post("/", authMiddleware, notasController.createNota);
router.put("/:companyId", authMiddleware, notasController.updateNota);
router.delete("/:companyId/:number", authMiddleware, notasController.deleteNota);
router.get("/:companyId", authMiddleware, notasController.listNotasByEmpresa)

export default router;