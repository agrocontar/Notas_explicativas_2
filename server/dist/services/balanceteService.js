"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBalanceEspecific = exports.listBalancetesCompany = exports.listBalancetePerYear = exports.createBalancete = void 0;
const prismaClient_1 = require("../prismaClient");
const errors_1 = require("../utils/errors");
const normalizeAccountingAccount_1 = require("../utils/normalizeAccountingAccount");
// Create Balancetes
const createBalancete = async (data) => {
    const company = await prismaClient_1.prisma.company.findUnique({
        where: { id: data.companyId }
    });
    if (!company)
        throw new errors_1.NotFoundError("Empresa com este ID não existe no banco de dados!");
    // REMOVER o processamento de mapeamentos - os dados já foram processados no frontend
    // const mappings = await prisma.configMapping.findMany({
    //   where: { companyId: data.companyId },
    //   include: {
    //     defaultAccount: true
    //   }
    // });
    // REMOVER - não processar novamente
    // const processedData = processMappedData(data.balanceteData, mappings);
    // Verificar se já existe balancete para esta empresa e data de referência
    const existingBalancete = await prismaClient_1.prisma.balanceteData.findFirst({
        where: {
            companyId: data.companyId,
            referenceDate: data.referenceDate
        }
    });
    // Se existir, deletar todos os registros para esta empresa e data
    if (existingBalancete) {
        await prismaClient_1.prisma.balanceteData.deleteMany({
            where: {
                companyId: data.companyId,
                referenceDate: data.referenceDate
            }
        });
    }
    // Criar os novos registros do balancete - usar os dados JÁ PROCESSADOS do frontend
    const balances = await prismaClient_1.prisma.balanceteData.createMany({
        data: data.balanceteData.map((row) => ({
            companyId: data.companyId,
            referenceDate: data.referenceDate,
            accountingAccount: row.accountingAccount, // Já está normalizado no frontend
            accountName: row.accountName,
            previousBalance: row.previousBalance,
            debit: row.debit,
            credit: row.credit,
            monthBalance: row.monthBalance,
            currentBalance: row.currentBalance,
        })),
    });
    return balances;
};
exports.createBalancete = createBalancete;
// Search of Company and year
const listBalancetePerYear = async (data) => {
    const balancetes = await prismaClient_1.prisma.balanceteData.findMany({
        where: {
            companyId: data.companyId,
            referenceDate: data.year
        }
    });
    if (!balancetes)
        throw new errors_1.NotFoundError('Nenhum Balancete encontrado nessa empresa!');
    return balancetes;
};
exports.listBalancetePerYear = listBalancetePerYear;
const listBalancetesCompany = async (companyId) => {
    try {
        const balancetes = await prismaClient_1.prisma.balanceteData.findMany({
            where: {
                companyId,
            },
            orderBy: {
                referenceDate: 'desc'
            }
        });
        return balancetes;
    }
    catch (error) {
        console.log(Error);
        return error;
    }
};
exports.listBalancetesCompany = listBalancetesCompany;
const listBalanceEspecific = async (companyId, year, accounting) => {
    if (!companyId || !year || !accounting) {
        throw new errors_1.NotFoundError('Parâmetros insuficientes para a busca do balancete!');
    }
    try {
        const balancete = await prismaClient_1.prisma.balanceteData.findFirst({
            where: {
                companyId,
                referenceDate: year,
                accountingAccount: (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(accounting)
            }
        });
        if (!balancete) {
            throw new errors_1.NotFoundError('Nenhum balancete encontrado para os critérios especificados!');
        }
        return balancete;
    }
    catch (error) {
        console.log(Error);
        return error;
    }
};
exports.listBalanceEspecific = listBalanceEspecific;
