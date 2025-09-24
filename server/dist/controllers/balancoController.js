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
exports.listBalancoTotal = void 0;
const handleZodError_1 = require("../utils/handleZodError");
const errors_1 = require("../utils/errors");
const balancoService = __importStar(require("../services/balancoService"));
const zod_1 = __importDefault(require("zod"));
const listBalancoTotalQuerySchema = zod_1.default.object({
    companyId: zod_1.default.string().uuid('ID da empresa inválido'),
    year: zod_1.default.coerce.number().int('Ano deve ser um número inteiro').min(2000).max(2100)
});
const listBalancoTotal = async (req, res) => {
    try {
        const parsed = listBalancoTotalQuerySchema.parse(req.query);
        const { companyId, year } = parsed;
        const result = await balancoService.listBalancoWithTotals({ companyId, year });
        res.json(result);
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(error) });
        }
        if (error instanceof errors_1.NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Erro ao listar balancete" });
    }
};
exports.listBalancoTotal = listBalancoTotal;
