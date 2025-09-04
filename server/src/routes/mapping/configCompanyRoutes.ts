import { Router } from "express";
import * as configCompany from "../../controllers/mapping/configCompanyController";
import * as configTemplate from "../../controllers/mapping/configTemplateController";
import * as configMapping from "../../controllers/mapping/configMappingController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

// config company routes
router.post("/company", authMiddleware ,configCompany.createConfig);
router.get("/company/:id", authMiddleware, configCompany.listConfigCompany);
router.put("/company", authMiddleware, configCompany.updateConfigCompany);

// mapping routes
router.post("/mapping", authMiddleware ,configMapping.createMapping);
router.put("/mapping/:id", authMiddleware ,configMapping.updateMappingCompany);
router.get("/mapping/:id", authMiddleware ,configMapping.listMappingCompany);
router.delete("/mapping/:id", authMiddleware ,configMapping.deleteMappingCompany);


// config template routes
router.get("/template", authMiddleware, configTemplate.listConfigTemplate);



export default router;
 