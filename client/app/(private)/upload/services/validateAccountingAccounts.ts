import { AccountValidationResult, BalanceteRow } from "../types";
import { fetchCompanyAccounts, fetchCompanyMappedAccounts, fetchDefaultAccounts } from "./apis";

export const validateAccountingAccounts = async (
  balanceteData: BalanceteRow[],
  companyId: string
): Promise<AccountValidationResult> => {
  try {
    // Buscar contas da empresa via API
    const companyMappedAccounts = await fetchCompanyMappedAccounts(companyId);
    
    // Buscar contas padrão do sistema via API
    const defaultAccounts = await fetchDefaultAccounts();
    
    const invalidAccounts: string[] = [];
    const validData: BalanceteRow[] = [];
    
    // Criar um Set para busca mais eficiente
    const validAccountsSet = new Set<string>();
    
    // Adicionar contas da empresa
    companyMappedAccounts.forEach(account => {
      validAccountsSet.add(account.companyAccount);
    });
    
    // Adicionar contas padrão do sistema
    defaultAccounts.forEach(account => {
      validAccountsSet.add(account.accountingAccount);
    });
    
    // Validar cada linha do balancete
    balanceteData.forEach(row => {
      const accountCode = row.accountingAccount.trim();
      
      if (validAccountsSet.has(accountCode)) {
        validData.push(row);
      } else {
        // Evitar duplicatas na lista de contas inválidas
        if (!invalidAccounts.includes(accountCode)) {
          invalidAccounts.push(accountCode);
        }
      }
    });
    
    return {
      isValid: invalidAccounts.length === 0,
      invalidAccounts,
      validData
    };
    
  } catch (error) {
    console.error('Erro ao validar contas contábeis:', error);
    throw new Error('Falha na validação das contas contábeis');
  }
};