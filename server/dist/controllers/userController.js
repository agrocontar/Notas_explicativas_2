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
exports.deleteUser = exports.updateUser = exports.getUsers = exports.createUser = void 0;
const zod_1 = require("zod");
const userService = __importStar(require("../services/userServices"));
const handleZodError_1 = require("../utils/handleZodError");
const userSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" }),
    role: zod_1.z.enum(['Admin', 'Coordenador', 'Colaborador'])
});
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6, { message: "Senha deve ter no minimo 6 caracteres" }).optional(),
    role: zod_1.z.enum(['Admin', 'Coordenador', 'Colaborador']).optional()
});
const createUser = async (req, res) => {
    try {
        const data = userSchema.parse(req.body);
        const user = await userService.createUser(data);
        res.json(user);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        res.status(400).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.createUser = createUser;
const getUsers = async (_, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
};
exports.getUsers = getUsers;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const parsed = updateUserSchema.parse(req.body);
        const updatedUser = await userService.updateUser({ ...parsed, userId: id });
        res.json(updatedUser);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: (0, handleZodError_1.handleZodError)(err) });
        }
        res.status(400).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.json({ message: 'Id não enviado' });
        }
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser)
            return res.json({ message: "Usuário não encontrado" });
        res.json({ message: "Usuario deletado com sucesso!" });
    }
    catch (err) {
        res.status(401).json({ error: err instanceof Error ? err.message : err });
    }
};
exports.deleteUser = deleteUser;
