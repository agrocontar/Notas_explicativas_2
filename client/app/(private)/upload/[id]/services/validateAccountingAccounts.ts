import { AccountValidationResult, BalanceteRow, CompanyAccount, MappedAccount } from "../types";
import { createCompanyConfigs, fetchCompanyAccounts, fetchDefaultAccounts, fetchCompanyMappings } from "./apis";

export const validateAccountingAccounts = async (
  balanceteData: BalanceteRow[],
  companyId: string
): Promise<AccountValidationResult> => {
  try {
    // Buscar contas da empresa via API
    const companyMappedAccounts = await fetchCompanyAccounts(companyId);
    
    // Buscar contas padrão do sistema via API
    const defaultAccounts = await fetchDefaultAccounts();
    
    // Buscar mapeamentos da empresa
    const companyMappings = await fetchCompanyMappings(companyId);
    
    const invalidAccountCodes: string[] = [];
    const invalidAccountsWithNames: CompanyAccount[] = [];
    const validData: BalanceteRow[] = [];
    
    // Criar um Set para busca mais eficiente
    const validAccountsSet = new Set<string>();
    
    // Adicionar contas da empresa
    companyMappings.forEach(account => {
      validAccountsSet.add(account.companyAccount);
    });
    
    // Adicionar contas padrão do sistema
    defaultAccounts.forEach(account => {
      validAccountsSet.add(account.accountingAccount);
    });
    
    // Criar mapa de mapeamentos para acesso rápido
    const mappingsMap = new Map<string, MappedAccount>();
    companyMappings.forEach(mapping => {
      mappingsMap.set(mapping.companyAccount, mapping);
    });
    
    // Validar cada linha do balancete e coletar nomes
    balanceteData.forEach(row => {
      const accountCode = row.accountingAccount.trim();
      
      if (validAccountsSet.has(accountCode)) {
        validData.push(row);
      } else {
        // Evitar duplicatas na lista de contas inválidas
        if (!invalidAccountCodes.includes(accountCode)) {
          invalidAccountCodes.push(accountCode);
          invalidAccountsWithNames.push({
            accountingAccount: accountCode,
            accountName: row.accountName.trim() || 'Conta não mapeada'
          });
        }
      }
    });

    // Criar contas inválidas automaticamente se houver (em background)
    if (invalidAccountsWithNames.length > 0) {
      try {
        createCompanyConfigs({
          companyId,
          configs: invalidAccountsWithNames
        })
        .then(() => {
          console.log(`✅ ${invalidAccountsWithNames.length} contas criadas automaticamente em background`);
        })
        .catch(createError => {
          console.error('Erro ao criar contas automaticamente:', createError);
        });
      } catch (createError) {
        console.error('Erro ao tentar criar contas:', createError);
      }
    }
    
    return {
      isValid: invalidAccountCodes.length === 0,
      invalidAccounts: invalidAccountCodes,
      validData,
      mappings: companyMappings // Retornar mapeamentos para uso posterior
    };
    
  } catch (error) {
    console.error('Erro ao validar contas contábeis:', error);
    throw new Error('Falha na validação das contas contábeis');
  }
};