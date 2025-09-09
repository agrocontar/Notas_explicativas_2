import { BalanceteRow, MappedAccount } from "../types";

export const processMappedAccounts = (
  balanceteData: BalanceteRow[],
  mappings: MappedAccount[]
): BalanceteRow[] => {
  // Criar mapa de mapeamentos para acesso rápido
  const mappingsMap = new Map<string, string>();
  mappings.forEach(mapping => {
    mappingsMap.set(mapping.companyAccount, mapping.defaultAccount.accountingAccount);
  });

  // Agrupar dados por conta padrão (conta de destino)
  const groupedData = new Map<string, BalanceteRow>();

  balanceteData.forEach(row => {
    const accountCode = row.accountingAccount.trim();
    
    // Verificar se esta conta tem mapeamento
    const targetAccountCode = mappingsMap.get(accountCode);
    
    if (targetAccountCode) {
      // Esta conta deve ser agrupada em outra conta
      if (groupedData.has(targetAccountCode)) {
        // Já existe entrada para esta conta padrão, somar valores
        const existingRow = groupedData.get(targetAccountCode)!;
        
        groupedData.set(targetAccountCode, {
          ...existingRow,
          previousBalance: (existingRow.previousBalance || 0) + (row.previousBalance || 0),
          debit: (existingRow.debit || 0) + (row.debit || 0),
          credit: (existingRow.credit || 0) + (row.credit || 0),
          monthBalance: (existingRow.monthBalance || 0) + (row.monthBalance || 0),
          currentBalance: (existingRow.currentBalance || 0) + (row.currentBalance || 0),
        });
      } else {
        // Primeira ocorrência desta conta padrão
        // Encontrar o nome da conta padrão
        const defaultAccount = mappings.find(m => m.defaultAccount.accountingAccount === targetAccountCode)?.defaultAccount;
        
        groupedData.set(targetAccountCode, {
          ...row,
          accountingAccount: targetAccountCode,
          accountName: defaultAccount?.accountName || `Agrupamento de ${row.accountName}`
        });
      }
    } else {
      // Não tem mapeamento, manter como está
      const key = accountCode;
      if (groupedData.has(key)) {
        const existingRow = groupedData.get(key)!;
        
        groupedData.set(key, {
          ...existingRow,
          previousBalance: (existingRow.previousBalance || 0) + (row.previousBalance || 0),
          debit: (existingRow.debit || 0) + (row.debit || 0),
          credit: (existingRow.credit || 0) + (row.credit || 0),
          monthBalance: (existingRow.monthBalance || 0) + (row.monthBalance || 0),
          currentBalance: (existingRow.currentBalance || 0) + (row.currentBalance || 0),
        });
      } else {
        groupedData.set(key, row);
      }
    }
  });

  return Array.from(groupedData.values());
};