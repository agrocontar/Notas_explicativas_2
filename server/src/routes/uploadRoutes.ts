import { Router } from "express";
import * as uploadController from "../controllers/uploadController";

const router = Router();

router.post("/", uploadController.createBalancete);

export default router;
