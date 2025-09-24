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
exports.deleteConfigNotMappedOfCompany = exports.deleteConfigCompany = exports.updateConfigCompany = exports.listConfigCompany = exports.createConfig = void 0;
const zod_1 = __importDefault(require("zod"));
const configService = __importStar(require("../../services/mapping/configCompanyServices"));
const handleZodError_1 = require("../../utils/handleZodError");
const errors_1 = require("../../utils/errors");
const configSchema = zod_1.default.object({
    companyId: zod_1.default.string(),
    configs: zod_1.default.object({
        accountingAccount: zod_1.default.string().max(10, 'Codigo da conta deve conter no máximo 10 caracteres!'),
        accountName: zod_1.default.string(),
    }).array()
});
const createConfig = async (req, res) => {
    try {
        const parsed = configSchema.parse(req.body);
        const result = await configService.createConfig(parsed);
        res.json(result);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        if (err instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        if (err instanceof errors_1.ConflictError) {
            return res.status(409).json({
                error: 'Conflito',
                message: err.message
            });
        }
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar Configuração" });
    }
};
exports.createConfig = createConfig;
const listConfigCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const configs = await configService.listConfigCompany(companyId);
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
exports.listConfigCompany = listConfigCompany;
const updateConfigCompany = async (req, res) => {
    try {
        const parsed = configSchema.parse(req.body);
        const result = await configService.updateConfigCompany(parsed);
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
exports.updateConfigCompany = updateConfigCompany;
const deleteConfigCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const accountingAccount = req.body.accountingAccount;
        const result = await configService.deleteOneConfigCompany(companyId, accountingAccount);
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
        res.status(500).json({ error: "Erro ao deletar Configuração" });
    }
};
exports.deleteConfigCompany = deleteConfigCompany;
const deleteConfigNotMappedOfCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const result = await configService.deleteConfigNotMappedOfCompany(companyId);
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
        res.status(500).json({ error: "Erro ao deletar Configurações não mapeadas" });
    }
};
exports.deleteConfigNotMappedOfCompany = deleteConfigNotMappedOfCompany;
