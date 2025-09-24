"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigCompany = exports.deleteConfigNotMappedOfCompany = exports.deleteOneConfigCompany = exports.updateConfigCompany = exports.listConfigCompany = exports.createConfig = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../../prismaClient");
const errors_1 = require("../../utils/errors");
const normalizeAccountingAccount_1 = require("../../utils/normalizeAccountingAccount");
// Create Config with json
const createConfig = async (data) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    try {
        const config = await prismaClient_1.prisma.configCompany.createMany({
            data: data.configs.map((row) => ({
                companyId: data.companyId,
                accountingAccount: (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(row.accountingAccount),
                accountName: row.accountName
            })),
        });
        return config;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // Extrair qual conta causou o problema
                const existingAccount = await prismaClient_1.prisma.configCompany.findFirst({
                    where: {
                        companyId: data.companyId,
                        accountingAccount: {
                            in: data.configs.map(row => (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(row.accountingAccount))
                        }
                    }
                });
                if (existingAccount) {
                    throw new errors_1.ConflictError(`Já existe uma conta com o código '${existingAccount.accountingAccount}' para esta empresa.`);
                }
                throw new errors_1.ConflictError("Já existe uma conta com esses dados para esta empresa.");
            }
        }
        throw error;
    }
};
exports.createConfig = createConfig;
// List configs of a company that are not yet mapped
const listConfigCompany = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    const unmappedConfigs = await prismaClient_1.prisma.configCompany.findMany({
        where: {
            companyId,
            // Filtra apenas as configurações que não têm mapeamento
            ConfigMapping: {
                none: {} // Nenhum mapeamento relacionado existe
            }
        },
        include: {
            // Inclui informações adicionais se necessário
            company: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return unmappedConfigs;
};
exports.listConfigCompany = listConfigCompany;
//update configs of a company
const updateConfigCompany = async (data) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    const accounts = data.configs.map(c => c.accountingAccount);
    const duplicates = accounts.filter((item, idx) => accounts.indexOf(item) !== idx);
    if (duplicates.length > 0) {
        throw new errors_1.NotFoundError(`Existe contas com o mesmo codigo na lista, codigos: ${[...new Set(duplicates)].join(', ')}`);
    }
    // delete all current configs of company
    await prismaClient_1.prisma.configCompany.deleteMany({
        where: { companyId: data.companyId }
    });
    // create new configs
    const configs = await prismaClient_1.prisma.configCompany.createMany({
        data: data.configs.map((row) => ({
            companyId: data.companyId,
            accountingAccount: (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(row.accountingAccount),
            accountName: row.accountName,
        }))
    });
    return configs;
};
exports.updateConfigCompany = updateConfigCompany;
const deleteOneConfigCompany = async (companyId, accountingAccount) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    const config = await prismaClient_1.prisma.configCompany.findUnique({
        where: {
            companyId_accountingAccount: {
                companyId,
                accountingAccount: (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(accountingAccount)
            }
        }
    });
    if (!config)
        throw new errors_1.NotFoundError("Configuração não encontrada nessa empresa!");
    await prismaClient_1.prisma.configCompany.delete({
        where: {
            id: config.id
        }
    });
    return { message: "Configuração deletada com sucesso!" };
};
exports.deleteOneConfigCompany = deleteOneConfigCompany;
const deleteConfigNotMappedOfCompany = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    const deletedConfigs = await prismaClient_1.prisma.configCompany.deleteMany({
        where: {
            companyId,
            // Filtra apenas as configurações que não têm mapeamento
            ConfigMapping: {
                none: {} // Nenhum mapeamento relacionado existe
            }
        }
    });
    return deletedConfigs;
};
exports.deleteConfigNotMappedOfCompany = deleteConfigNotMappedOfCompany;
const deleteConfigCompany = async (companyId) => {
    const company = await prismaClient_1.prisma.company.findUnique({ where: { id: companyId } });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    const deletedConfigs = await prismaClient_1.prisma.configCompany.deleteMany({
        where: {
            companyId
        }
    });
    return deletedConfigs;
};
exports.deleteConfigCompany = deleteConfigCompany;
