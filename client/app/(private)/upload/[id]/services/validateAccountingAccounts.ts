import { AccountValidationResult, BalanceteRow, CompanyAccount, MappedAccount } from "../types";
import { createCompanyConfigs, fetchCompanyAccounts, fetchDefaultAccounts, fetchCompanyMappings, fetchCompanyPlan } from "./apis";

export const validateAccountingAccounts = async (
  balanceteData: BalanceteRow[],
  companyId: string
): Promise<AccountValidationResult> => {
  try {
    // Buscar contas padrão do sistema via API
    const defaultAccounts = await fetchDefaultAccounts();
    const companyPlanResult = await fetchCompanyPlan(companyId);
    if (companyPlanResult === null || companyPlanResult === undefined) {
      throw new Error('Erro ao buscar configuração do plano da empresa');
    }

    const companyPlan = companyPlanResult.planOfCountsAgrocontar;
    // Buscar mapeamentos da empresa
    const companyMappings = await fetchCompanyMappings(companyId);
    // Buscar contas da empresa
    const existingCompanyAccounts = await fetchCompanyAccounts(companyId);

    const invalidAccountCodes: string[] = [];
    const accountsToCreate: CompanyAccount[] = [];
    const validData: BalanceteRow[] = [];

    // Criar conjuntos para busca eficiente
    const defaultAccountsSet = new Set(defaultAccounts.map(acc => acc.accountingAccount));
    const companyAccountsSet = new Set(existingCompanyAccounts.map(acc => acc.accountingAccount));
    const mappingsMap = new Map<string, MappedAccount>();
    companyMappings.forEach(mapping => {
      mappingsMap.set(mapping.companyAccount, mapping);
    });

    // Para cada conta no balancete
    for (const row of balanceteData) {
      const accountCode = row.accountingAccount.trim();
      
      console.log(`Validando conta: ${accountCode}`);

      // REGRA 2.1.3 e 2.2.3: Se a conta tem mapeamento, é válida
      if (mappingsMap.has(accountCode)) {
        console.log(`Conta ${accountCode} tem mapeamento direto`);
        validData.push(row);
        continue;
      }

      // REGRA 2.1.2: Se empresa usa plano padrão E conta existe no template
      if (companyPlan && defaultAccountsSet.has(accountCode)) {
        console.log(`Conta ${accountCode} existe no template (plano padrão)`);
        validData.push(row);
        continue;
      }

      // Verificar se a conta existe na configCompany (com código normalizado)
      const accountExists = Array.from(companyAccountsSet).some(existingAccount => 
        existingAccount.startsWith(accountCode) || accountCode.startsWith(existingAccount)
      );

      if (!accountExists) {
        // Conta não existe na configCompany, precisa criar
        console.log(`Conta ${accountCode} não existe, criando...`);
        accountsToCreate.push({
          accountingAccount: accountCode,
          accountName: row.accountName.trim() || 'Conta não mapeada'
        });
      } else {
        console.log(`Conta ${accountCode} já existe na empresa`);
      }

      // Adicionar à lista de inválidas (usuário precisa mapear)
      if (!invalidAccountCodes.includes(accountCode)) {
        invalidAccountCodes.push(accountCode);
      }
    }

    // Criar contas automaticamente se houver
    if (accountsToCreate.length > 0) {
      try {
        // Filtrar contas que já existem (pode haver conflito de normalização)
        const existingCompanyAccounts = await fetchCompanyAccounts(companyId);
        const existingAccountSet = new Set(existingCompanyAccounts.map(acc => acc.accountingAccount));
        
        const filteredAccountsToCreate = accountsToCreate.filter(account => 
          !existingAccountSet.has(account.accountingAccount)
        );

        if (filteredAccountsToCreate.length > 0) {
          createCompanyConfigs({
            companyId,
            configs: filteredAccountsToCreate
          })
          .then(() => {
            console.log(`✅ ${filteredAccountsToCreate.length} contas criadas automaticamente em background`);
          })
          .catch(createError => {
            console.error('Erro ao criar contas automaticamente:', createError);
          });
        } else {
          console.log('📝 Todas as contas já existem, nenhuma criação necessária');
        }
      } catch (createError) {
        console.error('Erro ao tentar criar contas:', createError);
      }
    }

    const isValid = invalidAccountCodes.length === 0;

    return {
      isValid,
      invalidAccounts: invalidAccountCodes,
      validData,
      mappings: companyMappings,
      usesStandardPlan: companyPlan
    };

  } catch (error) {
    console.error('Erro ao validar contas contábeis:', error);
    throw new Error('Falha na validação das contas contábeis');
  }
};