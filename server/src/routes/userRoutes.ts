import { Router } from "express";
import * as userController from "../controllers/userController";
import { authMiddleware, requireCoordenador } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware,  userController.createUser);
router.get("/", authMiddleware ,userController.getUsers);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware,requireCoordenador, userController.deleteUser);

export default router;
