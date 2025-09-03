import { Router } from "express";
import * as configCompany from "../../controllers/mapping/configCompanyController";
import * as configTemplate from "../../controllers/mapping/configTemplateController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/company", authMiddleware ,configCompany.createConfig);
router.get("/company/:id", authMiddleware, configCompany.listConfigCompany);
router.put("/company", authMiddleware, configCompany.updateConfigCompany);


router.get("/template", authMiddleware, configTemplate.listConfigTemplate);

export default router;
 