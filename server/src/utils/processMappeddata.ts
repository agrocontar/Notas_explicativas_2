import { Decimal } from "@prisma/client/runtime/library";

// Função auxiliar para processar dados mapeados no backend
export const processMappedData = (balanceteData: any[], mappings: any[]) => {
  const mappingsMap = new Map<string, string>();
  mappings.forEach(mapping => {
    mappingsMap.set(mapping.companyAccount, mapping.defaultAccount.accountingAccount);
  });

  const groupedData = new Map<string, any>();

  balanceteData.forEach(row => {
    const accountCode = row.accountingAccount.replace(/\W/g, "");
    const targetAccount = mappingsMap.get(accountCode) || accountCode;

    if (groupedData.has(targetAccount)) {
      const existingRow = groupedData.get(targetAccount);
      
      groupedData.set(targetAccount, {
        ...existingRow,
        previousBalance: new Decimal(existingRow.previousBalance).plus(new Decimal(row.previousBalance || 0)),
        debit: new Decimal(existingRow.debit).plus(new Decimal(row.debit || 0)),
        credit: new Decimal(existingRow.credit).plus(new Decimal(row.credit || 0)),
        monthBalance: new Decimal(existingRow.monthBalance).plus(new Decimal(row.monthBalance || 0)),
        currentBalance: new Decimal(existingRow.currentBalance).plus(new Decimal(row.currentBalance || 0)),
      });
    } else {
      
      groupedData.set(targetAccount, {
        ...row,
        accountingAccount: targetAccount,
        accountName: row.accountName
      });
    }
  });

  return Array.from(groupedData.values());
};