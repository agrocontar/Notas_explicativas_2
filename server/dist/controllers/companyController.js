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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.listUserCompanies = exports.updateCompanyPlan = exports.checkCompanyPlan = exports.listCompanies = exports.createCompany = void 0;
const zod_1 = __importDefault(require("zod"));
const companyService = __importStar(require("../services/companyServices"));
const handleZodError_1 = require("../utils/handleZodError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const companySchema = zod_1.default.object({
    name: zod_1.default.string(),
    cnpj: zod_1.default.string()
});
const updateCompanySchema = zod_1.default.object({
    name: zod_1.default.string().optional(),
    cnpj: zod_1.default.string().optional()
});
const createCompany = async (req, res) => {
    try {
        const data = companySchema.parse(req.body);
        const company = await companyService.createCompany(data);
        res.json(company);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        res.status(400).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.createCompany = createCompany;
const listCompanies = async (_, res) => {
    const companies = await companyService.listCompanies();
    res.json(companies);
};
exports.listCompanies = listCompanies;
const checkCompanyPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await companyService.checkCompanyPlan(id);
        res.json({ planOfCountsAgrocontar: plan });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : error });
    }
};
exports.checkCompanyPlan = checkCompanyPlan;
const updateCompanyPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlan = await companyService.updateCompanyPlan(id);
        res.json({ planOfCountsAgrocontar: updatedPlan });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : error });
    }
};
exports.updateCompanyPlan = updateCompanyPlan;
const listUserCompanies = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: "Token não fornecido" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const groupCompanies = await companyService.listUserCompanies(decoded.userId);
        res.json(groupCompanies);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.listUserCompanies = listUserCompanies;
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const parsed = updateCompanySchema.parse(req.body);
        const updatedCompany = await companyService.updateCompany({ ...parsed, companyId: id });
        res.json(updatedCompany);
    }
    catch (err) {
        res.status(401).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.updateCompany = updateCompany;
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            res.status(400).json({ message: "Parametro nao enviado!" });
        const deletedCompany = await companyService.deleteCompany(id);
        res.json(deletedCompany);
    }
    catch (err) {
        res.status(401).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.deleteCompany = deleteCompany;
