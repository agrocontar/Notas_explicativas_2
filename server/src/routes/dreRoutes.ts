import { Router } from "express";
import * as dreController from "../controllers/dreController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware , dreController.listDreTotal);


export default router;
