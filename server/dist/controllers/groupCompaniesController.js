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
exports.deleteGroup = exports.updateGroup = exports.listGroups = exports.createGroup = void 0;
const groupService = __importStar(require("../services/groupCompaniesServices"));
const zod_1 = __importDefault(require("zod"));
const handleZodError_1 = require("../utils/handleZodError");
const groupCompanySchema = zod_1.default.object({
    name: zod_1.default.string(),
});
// Create Groups Companys
const createGroup = async (req, res) => {
    try {
        const { name } = groupCompanySchema.parse(req.body);
        const group = await groupService.createGroupCompanies({ name });
        res.json(group);
    }
    catch (err) {
        if (err instanceof zod_1.default.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        res.status(400).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.createGroup = createGroup;
//List Groups
const listGroups = async (req, res) => {
    try {
        const groups = await groupService.listGroups();
        res.json(groups);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.listGroups = listGroups;
const updateGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { name, companyIds, userIds } = req.body;
        const updatedGroup = await groupService.updateGroup({ groupId, name, companyIds, userIds });
        res.json(updatedGroup);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        if (!groupId)
            res.status(400).json({ message: "Parametro não enviado" });
        const deletedGroup = groupService.deleteGroup(groupId);
        res.json(deletedGroup);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteGroup = deleteGroup;
