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

    const invalidAccountCodes: string[] = [];
    const invalidAccountsWithNames: CompanyAccount[] = [];
    const validData: BalanceteRow[] = [];

    // Criar um Set para busca mais eficiente
    const validAccountsSet = new Set<string>();

    // SEMPRE adicionar contas padrão do sistema (ambos os casos)
    defaultAccounts.forEach(account => {
      validAccountsSet.add(account.accountingAccount);
    });

    // Se a empresa utiliza plano padrão (companyPlan = true)
    if (companyPlan) {
      // Adicionar contas mapeadas da empresa
      companyMappings.forEach(account => {
        validAccountsSet.add(account.companyAccount);
      });

      console.log('Contas válidas para validação:', Array.from(validAccountsSet).slice(0, 10));

      // Validar cada conta contra o conjunto válido
      balanceteData.forEach(row => {
        const accountCode = row.accountingAccount.trim();

        if (validAccountsSet.has(accountCode)) {
          validData.push(row);
        } else {
          if (!invalidAccountCodes.includes(accountCode)) {
            invalidAccountCodes.push(accountCode);
            invalidAccountsWithNames.push({
              accountingAccount: accountCode,
              accountName: row.accountName.trim() || 'Conta não mapeada'
            });
          }
        }
      });
    }
    // Se a empresa NÃO utiliza plano padrão (companyPlan = false)
    else {
      // Coletar todas as contas únicas para verificação
      const uniqueAccounts = new Map<string, string>();
      balanceteData.forEach(row => {
        const accountCode = row.accountingAccount.trim();
        if (!uniqueAccounts.has(accountCode)) {
          uniqueAccounts.set(accountCode, row.accountName.trim() || 'Conta não mapeada');
        }
      });

      console.log('Contas únicas para validação:', Array.from(uniqueAccounts.keys()).slice(0, 10));

      // Verificar se as contas estão mapeadas
      uniqueAccounts.forEach((accountName, accountCode) => {
        const isMapped = companyMappings.some(mapping =>
          mapping.companyAccount === accountCode
        );

        if (isMapped) {
          // Se está mapeada, adicionar todas as linhas dessa conta aos dados válidos
          balanceteData.filter(row => row.accountingAccount.trim() === accountCode)
            .forEach(row => validData.push(row));
        } else {
          // Se não está mapeada, é inválida
          invalidAccountCodes.push(accountCode);
          invalidAccountsWithNames.push({
            accountingAccount: accountCode,
            accountName: accountName
          });
        }
      });
    }

    // Criar contas inválidas/novas automaticamente se houver (em background)
    if (invalidAccountsWithNames.length > 0) {
      try {
        // Primeiro, buscar as contas existentes da empresa
        const existingCompanyAccounts = await fetchCompanyAccounts(companyId);
        const existingAccountSet = new Set(existingCompanyAccounts.map(acc => acc.accountingAccount));

        // Filtrar apenas as contas que realmente não existem
        const accountsToCreate = invalidAccountsWithNames.filter(account =>
          !existingAccountSet.has(account.accountingAccount)
        );

        if (accountsToCreate.length > 0) {
          createCompanyConfigs({
            companyId,
            configs: accountsToCreate
          })
            .then(() => {
              console.log(`✅ ${accountsToCreate.length} contas criadas automaticamente em background`);
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

    // SEMPRE retornar isValid baseado na existência de contas não mapeadas
    // (comportamento consistente independente do tipo de plano)
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