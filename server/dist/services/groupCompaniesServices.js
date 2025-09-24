"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.updateGroup = exports.listGroups = exports.createGroupCompanies = void 0;
const prismaClient_1 = require("../prismaClient");
//Create Group of Companies
const createGroupCompanies = async (data) => {
    const group = await prismaClient_1.prisma.groupCompanies.create({
        data: {
            name: data.name,
        },
    });
    return group;
};
exports.createGroupCompanies = createGroupCompanies;
// List groups
const listGroups = async () => {
    return prismaClient_1.prisma.groupCompanies.findMany({
        include: {
            companies: true,
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        },
    });
};
exports.listGroups = listGroups;
//Atribute user to group
const updateGroup = async ({ userIds, companyIds, name, groupId }) => {
    const group = await prismaClient_1.prisma.groupCompanies.findFirst({ where: { id: groupId } });
    if (!group)
        throw new Error('Grupo inexistente');
    if (!userIds && !companyIds && !name)
        throw new Error('Sem dados para atualizar');
    const data = {};
    if (name)
        data.name = name;
    if (companyIds) {
        data.companies = {
            set: [], // Remove all current company
            connect: companyIds.map(id => ({ id }))
        };
    }
    if (userIds) {
        data.users = {
            set: [], // Remove all current users
            connect: userIds.map(id => ({ id }))
        };
    }
    const updatedGroup = await prismaClient_1.prisma.groupCompanies.update({
        where: { id: groupId },
        data,
        include: { companies: true, users: true }
    });
    return updatedGroup;
};
exports.updateGroup = updateGroup;
const deleteGroup = async (groupId) => {
    const group = await prismaClient_1.prisma.groupCompanies.findUnique({ where: { id: groupId } });
    if (!group)
        throw new Error('Grupo não encontrado!');
    await prismaClient_1.prisma.groupCompanies.delete({ where: { id: groupId } });
    return {
        id: group.id,
        name: group.name,
        createdAt: group.createdAt
    };
};
exports.deleteGroup = deleteGroup;
