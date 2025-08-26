import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.post("/login", userController.loginUser)

export default router;
