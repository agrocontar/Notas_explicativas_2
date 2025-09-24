"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDreWithTotals = void 0;
const prismaClient_1 = require("../prismaClient");
const errors_1 = require("../utils/errors");
const normalizeAccountingAccount_1 = require("../utils/normalizeAccountingAccount");
const listDreWithTotals = async (data) => {
    try {
        // Buscar todos os itens de DRE
        const dreItems = await prismaClient_1.prisma.dreTemplate.findMany({
            orderBy: {
                group: 'asc'
            }
        });
        if (!dreItems || dreItems.length === 0) {
            throw new errors_1.NotFoundError('Nenhum item de DRE encontrado!');
        }
        // Buscar balancetes do ano atual e do ano anterior
        const [balancetesAnoAtual, balancetesAnoAnterior] = await Promise.all([
            prismaClient_1.prisma.balanceteData.findMany({
                where: {
                    companyId: data.companyId,
                    referenceDate: data.year // Ano atual (2025)
                }
            }),
            prismaClient_1.prisma.balanceteData.findMany({
                where: {
                    companyId: data.companyId,
                    referenceDate: data.year - 1 // Ano anterior (2024)
                }
            })
        ]);
        if (!balancetesAnoAtual.length && !balancetesAnoAnterior.length) {
            throw new errors_1.NotFoundError('Nenhum balancete encontrado para os anos especificados!');
        }
        // Calcular os totais para cada item do DRE
        const dreWithTotals = await Promise.all(dreItems.map(async (dreItem) => {
            // Filtrar balancetes do ano atual
            const balancetesAnoAtualFiltrados = balancetesAnoAtual.filter(balancete => dreItem.accountingAccounts.some((accountCode) => balancete.accountingAccount === (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(accountCode)));
            // Filtrar balancetes do ano anterior
            const balancetesAnoAnteriorFiltrados = balancetesAnoAnterior.filter(balancete => dreItem.accountingAccounts.some((accountCode) => balancete.accountingAccount === (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(accountCode)));
            // Somar os currentBalance dos balancetes filtrados
            const totalCurrentYear = parseFloat(balancetesAnoAtualFiltrados.reduce((sum, balancete) => {
                return sum + Number(balancete.currentBalance);
            }, 0).toFixed(2));
            const totalPreviousYear = parseFloat(balancetesAnoAnteriorFiltrados.reduce((sum, balancete) => {
                return sum + Number(balancete.currentBalance);
            }, 0).toFixed(2));
            return {
                ...dreItem,
                accountingAccounts: dreItem.accountingAccounts.map((accountCode) => (0, normalizeAccountingAccount_1.normalizeAccountingAccount)(accountCode)),
                totalCurrentYear,
                totalPreviousYear,
            };
        }));
        return dreWithTotals;
    }
    catch (error) {
        console.error('Error in listDreWithTotals:', error);
        throw error;
    }
};
exports.listDreWithTotals = listDreWithTotals;
