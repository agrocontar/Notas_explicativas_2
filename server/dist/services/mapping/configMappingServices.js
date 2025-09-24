"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBulkMappings = exports.deleteMappingCompany = exports.updateMappingCompany = exports.createMappingCompany = exports.listMappingCompany = void 0;
const prismaClient_1 = require("../../prismaClient");
const errors_1 = require("../../utils/errors");
const normalizeAccountingAccount_1 = require("../../utils/normalizeAccountingAccount");
// List mapping of a company
const listMappingCompany = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    const configs = await prismaClient_1.prisma.configMapping.findMany({
        where: {
            companyId
        },
        include: {
            company: true,
            defaultAccount: true,
        }
    });
    return configs;
};
exports.listMappingCompany = listMappingCompany;
// Create mapping
const createMappingCompany = async (data) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    // Check if defaultAccount exists
    const systemAccount = await prismaClient_1.prisma.configTemplate.findUnique({
        where: { id: data.defaultAccountId }
    });
    if (!systemAccount)
        throw new errors_1.NotFoundError("Conta padrão não encontrada!");
    // Check if the company account exists in ConfigCompany
    const normalizedAccount = (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(data.companyAccount);
    const companyAccountExists = await prismaClient_1.prisma.configCompany.findUnique({
        where: {
            companyId_accountingAccount: {
                companyId: data.companyId,
                accountingAccount: normalizedAccount
            }
        }
    });
    if (!companyAccountExists) {
        throw new errors_1.NotFoundError(`Conta ${normalizedAccount} não existe na empresa, Primeiro adicione a conta em ConfigCompany antes de mapeá-la.`);
    }
    // Create the mapping
    const mapping = await prismaClient_1.prisma.configMapping.create({
        data: {
            companyId: data.companyId,
            companyAccount: normalizedAccount,
            defaultAccountId: data.defaultAccountId
        }
    });
    return mapping;
};
exports.createMappingCompany = createMappingCompany;
const updateMappingCompany = async (data) => {
    //check if mapping exists
    const mapping = await prismaClient_1.prisma.configMapping.findUnique({ where: { id: data.mappingId } });
    if (!mapping)
        throw new errors_1.NotFoundError(`Empresa com o ID ${data.mappingId} não existe no banco de dados!`);
    // check if company exists
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID nao existe no banco de dados!");
    // check if defaultAccount exists
    const systemAccount = await prismaClient_1.prisma.configTemplate.findUnique({ where: { id: data.defaultAccountId } });
    if (!systemAccount)
        throw new errors_1.NotFoundError("Conta padrão não encontrada!");
    const normalizedAccount = (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(data.companyAccount);
    const existing = await prismaClient_1.prisma.configMapping.findFirst({
        where: {
            companyId: data.companyId,
            companyAccount: normalizedAccount,
            NOT: { id: data.mappingId },
        },
    });
    if (!existing)
        throw new errors_1.NotFoundError(`Já existe um mapeamento com a conta ${normalizedAccount} para esta empresa!`);
    const payload = {
        companyAccount: normalizedAccount,
        defaultAccountId: data.defaultAccountId
    };
    const updatedConfig = await prismaClient_1.prisma.configMapping.update({
        where: { id: data.mappingId },
        data: payload,
    });
    return updatedConfig;
};
exports.updateMappingCompany = updateMappingCompany;
const deleteMappingCompany = async (mappingId) => {
    //check if mapping exists
    const mapping = await prismaClient_1.prisma.configMapping.findUnique({ where: { id: mappingId } });
    if (!mapping)
        throw new errors_1.NotFoundError(`Mapeamento com o ID ${mappingId} não existe no banco de dados!`);
    await prismaClient_1.prisma.configMapping.delete({ where: { id: mappingId } });
    return { message: "Mapeamento deletado com sucesso!" };
};
exports.deleteMappingCompany = deleteMappingCompany;
// Create bulk mappings automatically
const createBulkMappings = async (data) => {
    const company = await prismaClient_1.prisma.company.findUnique({
        where: { id: data.companyId }
    });
    if (!company) {
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    }
    const results = {
        success: [],
        errors: [],
        skipped: []
    };
    // Processar cada mapeamento
    for (const mapping of data.mappings) {
        try {
            const normalizedCompanyAccount = (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(mapping.companyAccount);
            const normalizedDefaultAccount = (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(mapping.defaultAccount);
            // Verificar se a conta da empresa existe
            const companyAccountExists = await prismaClient_1.prisma.configCompany.findUnique({
                where: {
                    companyId_accountingAccount: {
                        companyId: data.companyId,
                        accountingAccount: normalizedCompanyAccount
                    }
                }
            });
            if (!companyAccountExists) {
                results.errors.push({
                    companyAccount: mapping.companyAccount,
                    defaultAccount: mapping.defaultAccount,
                    error: `Conta ${normalizedCompanyAccount} não existe na empresa`
                });
                continue;
            }
            // Verificar se a conta padrão existe
            const defaultAccountExists = await prismaClient_1.prisma.configTemplate.findFirst({
                where: {
                    accountingAccount: normalizedDefaultAccount
                }
            });
            if (!defaultAccountExists) {
                results.errors.push({
                    companyAccount: mapping.companyAccount,
                    defaultAccount: mapping.defaultAccount,
                    error: `Conta padrão ${normalizedDefaultAccount} não encontrada`
                });
                continue;
            }
            // Verificar se o mapeamento já existe
            const existingMapping = await prismaClient_1.prisma.configMapping.findFirst({
                where: {
                    companyId: data.companyId,
                    companyAccount: normalizedCompanyAccount
                }
            });
            if (existingMapping) {
                results.skipped.push({
                    companyAccount: mapping.companyAccount,
                    defaultAccount: mapping.defaultAccount,
                    message: `Mapeamento já existe (ID: ${existingMapping.id})`
                });
                continue;
            }
            // Criar o mapeamento
            const newMapping = await prismaClient_1.prisma.configMapping.create({
                data: {
                    companyId: data.companyId,
                    companyAccount: normalizedCompanyAccount,
                    defaultAccountId: defaultAccountExists.id
                },
                include: {
                    defaultAccount: true
                }
            });
            results.success.push({
                companyAccount: mapping.companyAccount,
                defaultAccount: mapping.defaultAccount,
                mappingId: newMapping.id,
                message: "Mapeamento criado com sucesso"
            });
        }
        catch (error) {
            results.errors.push({
                companyAccount: mapping.companyAccount,
                defaultAccount: mapping.defaultAccount,
                error: error instanceof Error ? error.message : "Erro desconhecido"
            });
        }
    }
    return results;
};
exports.createBulkMappings = createBulkMappings;
