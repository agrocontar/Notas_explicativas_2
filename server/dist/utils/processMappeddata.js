"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMappedData = void 0;
const library_1 = require("@prisma/client/runtime/library");
// Função auxiliar para processar dados mapeados no backend
const processMappedData = (balanceteData, mappings) => {
    const mappingsMap = new Map();
    mappings.forEach(mapping => {
        mappingsMap.set(mapping.companyAccount, mapping.defaultAccount.accountingAccount);
    });
    const groupedData = new Map();
    balanceteData.forEach(row => {
        const accountCode = row.accountingAccount.replace(/\W/g, "");
        const targetAccount = mappingsMap.get(accountCode) || accountCode;
        if (groupedData.has(targetAccount)) {
            const existingRow = groupedData.get(targetAccount);
            groupedData.set(targetAccount, {
                ...existingRow,
                previousBalance: new library_1.Decimal(existingRow.previousBalance).plus(new library_1.Decimal(row.previousBalance || 0)),
                debit: new library_1.Decimal(existingRow.debit).plus(new library_1.Decimal(row.debit || 0)),
                credit: new library_1.Decimal(existingRow.credit).plus(new library_1.Decimal(row.credit || 0)),
                monthBalance: new library_1.Decimal(existingRow.monthBalance).plus(new library_1.Decimal(row.monthBalance || 0)),
                currentBalance: new library_1.Decimal(existingRow.currentBalance).plus(new library_1.Decimal(row.currentBalance || 0)),
            });
        }
        else {
            groupedData.set(targetAccount, {
                ...row,
                accountingAccount: targetAccount,
                accountName: row.accountName
            });
        }
    });
    return Array.from(groupedData.values());
};
exports.processMappedData = processMappedData;
