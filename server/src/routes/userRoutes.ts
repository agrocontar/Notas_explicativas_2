import { Router } from "express";
import * as userController from "../controllers/userController";
import { authMiddleware, requireAdmin, requireCoordenador } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, requireCoordenador, userController.createUser);
router.get("/", authMiddleware, requireCoordenador, userController.getUsers);
router.put("/:id", authMiddleware, requireCoordenador, userController.updateUser);
router.delete("/:id", authMiddleware, requireCoordenador,userController.deleteUser);


router.post("/login", userController.loginUser)
router.post("/refresh", userController.refreshUserToken)
router.post("/logout", userController.logoutUser)


export default router;
