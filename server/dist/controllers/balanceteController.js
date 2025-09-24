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
exports.listBalancetesCompany = exports.listBalancetePerYear = exports.createBalanceteController = void 0;
const zod_1 = require("zod");
const balanceteService = __importStar(require("../services/balanceteService"));
const handleZodError_1 = require("../utils/handleZodError");
const errors_1 = require("../utils/errors");
const listBalancetePerYearSchema = zod_1.z.object({
    year: zod_1.z.number(),
    companyId: zod_1.z.string()
});
const balanceteSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid(),
    referenceDate: zod_1.z.number(),
    balanceteData: zod_1.z.array(zod_1.z.object({
        accountingAccount: zod_1.z.string(),
        accountName: zod_1.z.string(),
        previousBalance: zod_1.z.number(),
        debit: zod_1.z.number(),
        credit: zod_1.z.number(),
        monthBalance: zod_1.z.number(),
        currentBalance: zod_1.z.number(),
    })),
});
const createBalanceteController = async (req, res) => {
    try {
        const parsed = balanceteSchema.parse(req.body);
        const result = await balanceteService.createBalancete(parsed);
        res.json({ success: true, inserted: result.count });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        if (err instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar balancete" });
    }
};
exports.createBalanceteController = createBalanceteController;
const listBalancetePerYear = async (req, res) => {
    try {
        const parsed = listBalancetePerYearSchema.parse(req.body);
        const result = await balanceteService.listBalancetePerYear(parsed);
        res.json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(error) });
        }
        if (error instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Erro ao listar balancete" });
    }
};
exports.listBalancetePerYear = listBalancetePerYear;
const listBalancetesCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const result = await balanceteService.listBalancetesCompany(companyId);
        res.json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(error) });
        }
        if (error instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Erro ao listar balancete" });
    }
};
exports.listBalancetesCompany = listBalancetesCompany;
