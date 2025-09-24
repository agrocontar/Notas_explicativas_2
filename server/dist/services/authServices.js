"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// Login
const login = async (email, password) => {
    // user not found
    const user = await prismaClient_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Usuário não encontrado!");
    // invalid password
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid)
        throw new Error("Senha Inválida");
    // Generate token
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "6h" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return { token, refreshToken, user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        } };
};
exports.login = login;
// generate new RefreshToken
const refreshToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const newToken = jsonwebtoken_1.default.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: "6h" });
        return newToken;
    }
    catch {
        throw new Error("Refresh token inválido");
    }
};
exports.refreshToken = refreshToken;
