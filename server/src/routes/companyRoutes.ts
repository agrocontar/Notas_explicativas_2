import { Router } from "express";
import * as companyController from "../controllers/companyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, companyController.createCompany);
router.get("/", authMiddleware, companyController.listCompanies)
router.put("/:id", authMiddleware, companyController.updateCompany)
router.delete("/:id", authMiddleware, companyController.deleteCompany)

router.get("/user/", authMiddleware, companyController.listUserCompanies)


export default router;
