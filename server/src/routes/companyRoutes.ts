import { Router } from "express";
import * as companyController from "../controllers/companyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, companyController.createCompany);
router.get("/", authMiddleware, companyController.listCompanies)
router.get("/user/:userId", authMiddleware, companyController.listUserCompanies)


export default router;
