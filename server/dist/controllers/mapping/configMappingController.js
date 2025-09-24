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
exports.createBulkMappingsController = exports.deleteMappingCompany = exports.updateMappingCompany = exports.listMappingCompany = exports.createMapping = void 0;
const zod_1 = __importDefault(require("zod"));
const mappingService = __importStar(require("../../services/mapping/configMappingServices"));
const handleZodError_1 = require("../../utils/handleZodError");
const errors_1 = require("../../utils/errors");
const configSchema = zod_1.default.object({
    companyId: zod_1.default.string(),
    companyAccount: zod_1.default.string(),
    defaultAccountId: zod_1.default.number(),
});
const createMapping = async (req, res) => {
    try {
        const parsed = configSchema.parse(req.body);
        const result = await mappingService.createMappingCompany(parsed);
        res.json(result);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        if (err instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar Configuração" });
    }
};
exports.createMapping = createMapping;
const listMappingCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const configs = await mappingService.listMappingCompany(companyId);
        res.json(configs);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        if (err instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao Listar Configurações" });
    }
};
exports.listMappingCompany = listMappingCompany;
const updateMappingCompany = async (req, res) => {
    try {
        const parsed = configSchema.parse(req.body);
        const mappingId = Number(req.params.id);
        if (isNaN(mappingId)) {
            res.status(400).json({ error: "ID inválido, precisa ser numérico!" });
            return;
        }
        const result = await mappingService.updateMappingCompany({ ...parsed, mappingId });
        res.json(result);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        if (err instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao editar Configurações" });
    }
};
exports.updateMappingCompany = updateMappingCompany;
const deleteMappingCompany = async (req, res) => {
    try {
        const mappingId = Number(req.params.id);
        if (isNaN(mappingId)) {
            res.status(400).json({ error: "ID inválido, precisa ser numérico!" });
            return;
        }
        const result = await mappingService.deleteMappingCompany(mappingId);
        res.json(result);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        if (err instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao deletar Mapeamento" });
    }
};
exports.deleteMappingCompany = deleteMappingCompany;
const bulkMappingSchema = zod_1.default.object({
    companyId: zod_1.default.string().uuid(),
    mappings: zod_1.default.array(zod_1.default.object({
        companyAccount: zod_1.default.string(),
        defaultAccount: zod_1.default.string(),
    }))
});
const createBulkMappingsController = async (req, res) => {
    try {
        const parsed = bulkMappingSchema.parse(req.body);
        const result = await mappingService.createBulkMappings(parsed);
        res.json({
            success: true,
            summary: {
                total: parsed.mappings.length,
                success: result.success.length,
                errors: result.errors.length,
                skipped: result.skipped.length
            },
            details: result
        });
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao criar mapeamentos em massa" });
    }
};
exports.createBulkMappingsController = createBulkMappingsController;
