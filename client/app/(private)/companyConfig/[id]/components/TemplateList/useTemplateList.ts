'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Toast } from 'primereact/toast';
import { createAccount, deleteMultipleAccounts, getSourceData, relateAccounts, relateMultipleAccounts } from './actions';
import { Account } from './types';

interface CreateAccountData {
  accountName: string;
  accountingAccount: string;
}

export const useTemplateList = (companyId: string, initialData: Account[]) => {
  const [source, setSource] = useState<Account[]>([]);
  const [target, setTarget] = useState<Account[]>(initialData || []);
  const [selectedTarget, setSelectedTarget] = useState<Account | null>(null);
  const [selectedMultipleSources, setSelectedMultipleSources] = useState<Account[]>([]);
  const [sourceFilter, setSourceFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [sourceLoading, setSourceLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteMultipleLoading, setDeleteMultipleLoading] = useState(false);
  const [bulkMappingLoading, setBulkMappingLoading] = useState(false); // NOVO LOADING
  
  const toast = useRef<Toast>(null);

  // Carregar dados da fonte - simplificado como na tabela padrão
  const loadSourceData = useCallback(async () => {
    setSourceLoading(true);
    try {
      const result = await getSourceData(companyId);
      
      let sourceData: Account[] = [];
      
      if (Array.isArray(result)) {
        sourceData = result;
      } else if (result && typeof result === 'object') {
        sourceData = (result as any).data || (result as any).items || [];
      }
      
      setSource(sourceData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao carregar contas não parametrizadas',
        life: 3000
      });
      setSource([]);
    } finally {
      setSourceLoading(false);
    }
  }, [companyId]);

  // Carregar dados iniciais uma única vez
  useEffect(() => {
    loadSourceData();
  }, [loadSourceData]);

  // NOVA FUNÇÃO: Mapeamento em massa de múltiplas contas para uma conta padrão
  const handleBulkMapping = useCallback(async (sourceAccounts: Account[], targetAccount: Account) => {
    if (!sourceAccounts || sourceAccounts.length === 0 || !targetAccount) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos uma conta não parametrizada e uma conta padrão',
        life: 3000
      });
      return;
    }

    setBulkMappingLoading(true);
    try {
      const sourceAccountingAccounts = sourceAccounts.map(account => account.accountingAccount);
      const result = await relateMultipleAccounts(companyId, sourceAccountingAccounts, targetAccount.accountingAccount);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${sourceAccounts.length} conta(s) mapeada(s) para ${targetAccount.accountName} com sucesso`,
        life: 3000
      });
      
      // Remover as contas mapeadas da lista de não parametrizadas
      const sourceAccountIds = sourceAccounts.map(account => account.id);
      setSource(prev => (prev || []).filter(item => !sourceAccountIds.includes(item.id)));
      
      // Limpar seleções
      setSelectedMultipleSources([]);
      setSelectedTarget(null);
      
      return result;
      
    } catch (error: any) {
      console.error('Erro ao mapear contas em massa:', error);
      
      const errorMessage = error.message || 'Falha ao mapear contas';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
        life: 5000
      });
      throw error;
    } finally {
      setBulkMappingLoading(false);
    }
  }, [companyId]);

  const handleCreateAccount = useCallback(async (accountData: CreateAccountData) => {
    setCreateLoading(true);
    try {
      const createdAccount = await createAccount({
        companyId: companyId,
        configs: [{
          accountName: accountData.accountName,
          accountingAccount: accountData.accountingAccount
        }]
      });
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Conta criada com sucesso',
        life: 3000
      });
      
      await loadSourceData();
      
      return createdAccount;
      
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: error.message || 'Falha ao criar conta',
        life: 5000
      });
    } finally {
      setCreateLoading(false);
    }
  }, [companyId, loadSourceData]);

  const handleDeleteMultipleAccounts = useCallback(async (accounts: Account[]) => {
    if (!accounts || accounts.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos uma conta para excluir',
        life: 3000
      });
      return;
    }

    setDeleteMultipleLoading(true);
    try {
      const accountingAccounts = accounts.map(account => account.accountingAccount);
      await deleteMultipleAccounts(companyId, accountingAccounts);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${accounts.length} conta(s) excluída(s) com sucesso`,
        life: 3000
      });
      
      // Recarregar os dados
      await loadSourceData();
      setSelectedMultipleSources([]); // Limpar seleção
      
    } catch (error: any) {
      console.error('Erro ao excluir contas:', error);
      
      const errorMessage = error.message || 'Falha ao excluir contas';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
        life: 5000
      });
      throw error;
    } finally {
      setDeleteMultipleLoading(false);
    }
  }, [companyId, loadSourceData]);

  // Filtros aplicados localmente (igual para ambas as tabelas)
  const filteredTarget = useMemo(() => {
    if (!targetFilter) return target;
    return target.filter(item => 
      item?.accountingAccount?.toLowerCase().includes(targetFilter.toLowerCase()) || 
      item?.accountName?.toLowerCase().includes(targetFilter.toLowerCase())
    );
  }, [target, targetFilter]);

  const filteredSource = useMemo(() => {
    if (!sourceFilter) return source;
    return source.filter(item => 
      item?.accountingAccount?.toLowerCase().includes(sourceFilter.toLowerCase()) || 
      item?.accountName?.toLowerCase().includes(sourceFilter.toLowerCase())
    );
  }, [source, sourceFilter]);

  return {
    source: filteredSource,
    target: filteredTarget,
    selectedTarget,
    selectedMultipleSources,
    sourceFilter,
    targetFilter,
    sourceLoading,
    createLoading,
    deleteMultipleLoading,
    bulkMappingLoading, // NOVO
    toast,
    setSourceFilter: useCallback((value: string) => setSourceFilter(value), []),
    setTargetFilter: useCallback((value: string) => setTargetFilter(value), []),
    setSelectedTarget: useCallback((value: Account | null) => setSelectedTarget(value), []),
    setSelectedMultipleSources: useCallback((value: Account[]) => setSelectedMultipleSources(value), []),
    handleBulkMapping, // NOVA FUNÇÃO
    handleCreateAccount,
    handleDeleteMultipleAccounts
  };
};