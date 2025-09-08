'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Toast } from 'primereact/toast';
import { getSourceData, relateAccounts } from './actions';
import { Account } from './types';

export const useTemplateList = (companyId: string, initialData: Account[]) => {
  const [source, setSource] = useState<Account[]>([]);
  const [target, setTarget] = useState<Account[]>(initialData || []);
  const [selectedSource, setSelectedSource] = useState<Account | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Account | null>(null);
  const [sourceFilter, setSourceFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  
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

  const handleDePara = useCallback(async () => {
    if (!selectedSource || !selectedTarget) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma conta de cada tabela',
        life: 3000
      });
      return;
    }
    
    try {
      setLoading(true);
      await relateAccounts(companyId, selectedSource.accountingAccount, selectedTarget.id);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Contas relacionadas com sucesso',
        life: 3000
      });
      
      // Remover a conta da lista de não parametrizadas
      setSource(prev => (prev || []).filter(item => item.id !== selectedSource.id));
      
    } catch (error) {
      console.error('Erro ao relacionar contas:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao relacionar contas',
        life: 3000
      });
    } finally {
      setLoading(false);
      setSelectedSource(null);
      setSelectedTarget(null);
    }
  }, [companyId, selectedSource, selectedTarget]);

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
    selectedSource,
    selectedTarget,
    sourceFilter,
    targetFilter,
    loading,
    sourceLoading,
    toast,
    setSourceFilter: useCallback((value: string) => setSourceFilter(value), []),
    setTargetFilter: useCallback((value: string) => setTargetFilter(value), []),
    setSelectedSource: useCallback((value: Account | null) => setSelectedSource(value), []),
    setSelectedTarget: useCallback((value: Account | null) => setSelectedTarget(value), []),
    handleDePara
  };
};