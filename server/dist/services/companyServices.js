"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.listUserCompanies = exports.updateCompanyPlan = exports.checkCompanyPlan = exports.listCompanies = exports.createCompany = void 0;
const prismaClient_1 = require("../prismaClient");
// Create Company
const createCompany = async (data) => {
    const companyExists = await prismaClient_1.prisma.company.findFirst({ where: { name: data.name } });
    if (companyExists)
        throw new Error('Empresa já existe!');
    const company = prismaClient_1.prisma.company.create({ data });
    return company;
};
exports.createCompany = createCompany;
// List Company
const listCompanies = async () => {
    return prismaClient_1.prisma.company.findMany();
};
exports.listCompanies = listCompanies;
const checkCompanyPlan = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new Error('Empresa não encontrada!');
    return company.planOfCountsAgrocontar;
};
exports.checkCompanyPlan = checkCompanyPlan;
const updateCompanyPlan = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new Error('Empresa não encontrada!');
    const updatedCompany = await prismaClient_1.prisma.company.update({
        where: { id: companyId },
        data: { planOfCountsAgrocontar: !company.planOfCountsAgrocontar }
    });
    return updatedCompany;
};
exports.updateCompanyPlan = updateCompanyPlan;
// List Companies per user group
const listUserCompanies = async (userId) => {
    const user = await prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error('Usuário não encontrado!');
    const groupCompanies = await prismaClient_1.prisma.groupCompanies.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        }, include: {
            companies: true
        }
    });
    // Flatter and remove duplicateds
    const companyMap = new Map();
    groupCompanies.forEach(group => {
        group.companies.forEach(company => {
            companyMap.set(company.id, company);
        });
    });
    const uniqueCompanies = Array.from(companyMap.values());
    return uniqueCompanies;
};
exports.listUserCompanies = listUserCompanies;
const updateCompany = async ({ companyId, cnpj, name }) => {
    if (!companyId)
        throw new Error("Id da empresa não informado");
    const company = await prismaClient_1.prisma.company.findUnique({
        where: { id: companyId }
    });
    if (!company)
        throw new Error("Empresa não encontrada");
    // verify if cnpj is active
    if (cnpj && company.cnpj !== cnpj) {
        const existingCompanyWithCnpj = await prismaClient_1.prisma.company.findFirst({
            where: {
                cnpj: cnpj,
                id: { not: companyId } // Except the current company
            }
        });
        if (existingCompanyWithCnpj) {
            throw new Error("CNPJ já está sendo utilizado por outra empresa");
        }
    }
    const data = {};
    if (cnpj)
        data.cnpj = cnpj;
    if (name)
        data.name = name;
    if (Object.keys(data).length === 0) {
        return company;
    }
    const updatedCompany = await prismaClient_1.prisma.company.update({
        where: { id: companyId },
        data
    });
    return updatedCompany;
};
exports.updateCompany = updateCompany;
const deleteCompany = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new Error('Empresa não encontrada!');
    await prismaClient_1.prisma.company.delete({ where: { id: companyId } });
    return {
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        createdAt: company.createdAt
    };
};
exports.deleteCompany = deleteCompany;
