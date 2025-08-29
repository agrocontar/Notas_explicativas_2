import { Router } from "express";
import * as userController from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware,userController.createUser);
router.get("/", authMiddleware, userController.getUsers);
router.put("/", authMiddleware, userController.updateUser);


router.post("/login", userController.loginUser)
router.post("/refresh", userController.refreshUserToken)
router.post("/logout", userController.logoutUser)


export default router;
