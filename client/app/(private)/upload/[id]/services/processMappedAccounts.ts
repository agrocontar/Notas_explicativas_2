import { BalanceteRow, MappedAccount, DefaultAccount } from "../types";

export const processMappedAccounts = (
  balanceteData: BalanceteRow[],
  mappings: MappedAccount[],
  defaultAccounts: DefaultAccount[],
  usesStandardPlan: boolean // Novo parâmetro
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

  // Primeiro, processar cada linha individualmente aplicando os mapeamentos
  const processedRows: BalanceteRow[] = balanceteData.map(row => {
    const accountCode = row.accountingAccount.trim();
    const mapping = mappingsMap.get(accountCode);
    
    if (mapping) {
      // REGRA 2.1.3 e 2.2.3: Tem mapeamento - usar conta padrão
      return {
        ...row,
        accountingAccount: mapping.defaultAccount.accountingAccount,
        accountName: mapping.defaultAccount.accountName
      };
    } else if (usesStandardPlan && defaultAccountMap.has(accountCode)) {
      // REGRA 2.1.2: Empresa usa plano padrão E conta existe no template
      // Usar nome da conta padrão mas manter o código original
      return {
        ...row,
        accountName: defaultAccountMap.get(accountCode)!
      };
    } else {
      // Manter original (não deve acontecer para dados válidos)
      return row;
    }
  });

  // Agora agrupar por conta contábil e somar os valores
  const groupedData = new Map<string, BalanceteRow>();
  
  processedRows.forEach(row => {
    const accountCode = row.accountingAccount;
    
    if (groupedData.has(accountCode)) {
      // Já existe entrada para esta conta, somar valores
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
      // Primeira ocorrência desta conta
      groupedData.set(accountCode, { ...row });
    }
  });

  // Log para debug
  console.log('Dados processados após mapeamento:');
  Array.from(groupedData.entries()).forEach(([accountCode, row]) => {
    console.log(`Conta: ${accountCode}, Nome: ${row.accountName}, Débito: ${row.debit}, Crédito: ${row.credit}`);
  });

  return Array.from(groupedData.values());
};