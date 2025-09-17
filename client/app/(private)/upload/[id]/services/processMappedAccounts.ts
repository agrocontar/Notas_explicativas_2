import { BalanceteRow, MappedAccount, DefaultAccount } from "../types";

export const processMappedAccounts = (
  balanceteData: BalanceteRow[],
  mappings: MappedAccount[],
  defaultAccounts: DefaultAccount[] // Adicionar parâmetro para contas padrão
): BalanceteRow[] => {
  // Criar mapa de mapeamentos para acesso rápido
  const mappingsMap = new Map<string, MappedAccount>();
  mappings.forEach(mapping => {
    mappingsMap.set(mapping.companyAccount, mapping);
  });

  // Criar mapa de contas padrão para acesso rápido (código → nome)
  const defaultAccountMap = new Map<string, string>();
  defaultAccounts.forEach(account => {
    defaultAccountMap.set(account.accountingAccount, account.accountName);
  });

  // Agrupar dados por conta
  const groupedData = new Map<string, BalanceteRow>();

  balanceteData.forEach(row => {
    const accountCode = row.accountingAccount.trim();
    
    // Verificar se esta conta tem mapeamento explícito
    const mapping = mappingsMap.get(accountCode);
    
    if (mapping) {
      // CASO 1: Tem mapeamento explícito - usar conta padrão do mapeamento
      const targetAccountCode = mapping.defaultAccount.accountingAccount;
      const targetAccountName = mapping.defaultAccount.accountName;
      
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
        groupedData.set(targetAccountCode, {
          accountingAccount: targetAccountCode,
          accountName: targetAccountName,
          previousBalance: row.previousBalance || 0,
          debit: row.debit || 0,
          credit: row.credit || 0,
          monthBalance: row.monthBalance || 0,
          currentBalance: row.currentBalance || 0
        });
      }
    } else {
      // CASO 2: Não tem mapeamento explícito
      // Verificar se é uma conta padrão (código igual ao padrão)
      const defaultAccountName = defaultAccountMap.get(accountCode);
      
      if (defaultAccountName) {
        // CASO 2A: É uma conta padrão - usar nome da conta padrão
        if (groupedData.has(accountCode)) {
          const existingRow = groupedData.get(accountCode)!;
          
          groupedData.set(accountCode, {
            ...existingRow,
            accountName: defaultAccountName, // Garantir nome padrão
            previousBalance: (existingRow.previousBalance || 0) + (row.previousBalance || 0),
            debit: (existingRow.debit || 0) + (row.debit || 0),
            credit: (existingRow.credit || 0) + (row.credit || 0),
            monthBalance: (existingRow.monthBalance || 0) + (row.monthBalance || 0),
            currentBalance: (existingRow.currentBalance || 0) + (row.currentBalance || 0),
          });
        } else {
          groupedData.set(accountCode, {
            ...row,
            accountName: defaultAccountName // Usar nome padrão ao invés do nome original
          });
        }
      } else {
        // CASO 2B: Não é uma conta padrão - manter como está (conta customizada)
        if (groupedData.has(accountCode)) {
          const existingRow = groupedData.get(accountCode)!;
          
          groupedData.set(accountCode, {
            ...existingRow,
            previousBalance: (existingRow.previousBalance || 0) + (row.previousBalance || 0),
            debit: (existingRow.debit || 0) + (row.debit || 0),
            credit: (existingRow.credit || 0) + (row.credit || 0),
            monthBalance: (existingRow.monthBalance || 0) + (row.monthBalance || 0),
            currentBalance: (existingRow.currentBalance || 0) + (row.currentBalance || 0),
          });
        } else {
          groupedData.set(accountCode, row);
        }
      }
    }
  });

  // Log para debug
  console.log('Dados processados após mapeamento:');
  Array.from(groupedData.values()).forEach(item => {
    console.log(`Conta: ${item.accountingAccount}, Nome: ${item.accountName}`);
  });

  return Array.from(groupedData.values());
};