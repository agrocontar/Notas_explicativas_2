"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.createUser = void 0;
const prismaClient_1 = require("../prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Hash the password and create user
const createUser = async (data) => {
    // user not found
    const userExistes = await prismaClient_1.prisma.user.findUnique({ where: { email: data.email } });
    if (userExistes)
        throw new Error("Usuário com este e-mail já existe!");
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await prismaClient_1.prisma.user.create({
        data: { ...data, password: hashedPassword }
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
};
exports.createUser = createUser;
// List all users
const getAllUsers = async () => {
    return prismaClient_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};
exports.getAllUsers = getAllUsers;
const updateUser = async ({ userId, email, name, password, role }) => {
    if (!email && !name && !password && !role)
        throw new Error('Sem dados para atualizar');
    const user = await prismaClient_1.prisma.user.findFirst({ where: { id: userId } });
    if (!user)
        throw new Error('Usuário nao existe!');
    const data = {};
    if (name)
        data.name = name;
    if (email)
        data.email = email;
    if (role)
        data.role = role;
    if (password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        data.password = hashedPassword;
    }
    const updateUser = await prismaClient_1.prisma.user.update({
        where: { id: userId },
        data,
    });
    return updateUser;
};
exports.updateUser = updateUser;
const deleteUser = async (userId) => {
    if (!userId)
        throw new Error('Id de Usuario não enviado!');
    const user = await prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error('Usuário não encontrado!');
    await prismaClient_1.prisma.user.delete({ where: { id: userId } });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
};
exports.deleteUser = deleteUser;
