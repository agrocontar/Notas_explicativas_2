import { Router } from "express";
import * as companyController from "../controllers/companyController";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, requireAdmin ,companyController.createCompany);
router.get("/", authMiddleware, requireAdmin,companyController.listCompanies)
router.get("/:id", authMiddleware, requireAdmin,companyController.listUniqueCompany)
router.put("/:id", authMiddleware, requireAdmin,companyController.updateCompany)
router.delete("/:id", authMiddleware,requireAdmin, companyController.deleteCompany)

router.get("/user/", authMiddleware, companyController.listUserCompanies)
router.get("/plan/:id", authMiddleware, companyController.checkCompanyPlan)
router.put("/plan/:id", authMiddleware, companyController.updateCompanyPlan)


export default router;
