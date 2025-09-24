"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCoordenador = exports.requireAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: "Token não fornecido" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: "Acesso negado. Requer permissão de Administrador" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireCoordenador = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const allowedRoles = ['Admin', 'Coordenador'];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Acesso negado. Requer permissão de Coordenador ou superior" });
    }
    next();
};
exports.requireCoordenador = requireCoordenador;
