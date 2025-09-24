"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configCompany = __importStar(require("../../controllers/mapping/configCompanyController"));
const configTemplate = __importStar(require("../../controllers/mapping/configTemplateController"));
const configMapping = __importStar(require("../../controllers/mapping/configMappingController"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// config company routes
router.post("/company", authMiddleware_1.authMiddleware, configCompany.createConfig);
router.get("/company/:id", authMiddleware_1.authMiddleware, configCompany.listConfigCompany);
router.put("/company", authMiddleware_1.authMiddleware, configCompany.updateConfigCompany);
router.delete("/company/:id", authMiddleware_1.authMiddleware, configCompany.deleteConfigCompany);
router.delete("/company/notMapped/:id", authMiddleware_1.authMiddleware, configCompany.deleteConfigNotMappedOfCompany);
// mapping routes
router.post("/mapping", authMiddleware_1.authMiddleware, configMapping.createMapping);
router.put("/mapping/:id", authMiddleware_1.authMiddleware, configMapping.updateMappingCompany);
router.get("/mapping/:id", authMiddleware_1.authMiddleware, configMapping.listMappingCompany);
router.delete("/mapping/:id", authMiddleware_1.authMiddleware, configMapping.deleteMappingCompany);
router.post('/mappings/bulk', authMiddleware_1.authMiddleware, configMapping.createBulkMappingsController);
// config template routes
router.get("/template", authMiddleware_1.authMiddleware, configTemplate.listConfigTemplate);
exports.default = router;
