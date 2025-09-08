'use client';
import { Toast } from 'primereact/toast';
import { useTemplateList } from './useTemplateList';
import { AccountTable } from './components/AccountTable';
import { ActionButton } from './components/ActionButton';
import { FilterHeader } from './components/FilterHeader';
import { TemplateListProps } from './types';
import './TemplateList.css';
import { memo, useMemo } from 'react';

// Componentes memoizados iguais para ambas as tabelas
const LeftToolbar = memo(() => (
  <div className="flex flex-column gap-2">
    <span className="text-xl font-bold">Contas não parametrizadas</span>
    <span>Selecione uma conta</span>
  </div>
));

const RightToolbar = memo(() => (
  <div className="flex flex-column gap-2">
    <span className="text-xl font-bold">Contas Padrão</span>
    <span>Selecione uma conta</span>
  </div>
));

export default function TemplateList({ companyId, initialData }: TemplateListProps) {
  const {
    source,
    target,
    selectedSource,
    selectedTarget,
    sourceFilter,
    targetFilter,
    loading,
    sourceLoading,
    toast,
    setSourceFilter,
    setTargetFilter,
    setSelectedSource,
    setSelectedTarget,
    handleDePara
  } = useTemplateList(companyId, initialData);

  // Headers memoizados - comportamento igual para ambas as tabelas
  const sourceHeader = useMemo(() => (
    <FilterHeader
      filterValue={sourceFilter}
      onFilterChange={setSourceFilter}
      selectedAccount={selectedSource}
      placeholder="Filtrar por código ou nome"
    />
  ), [sourceFilter, selectedSource, setSourceFilter]);

  const targetHeader = useMemo(() => (
    <FilterHeader
      filterValue={targetFilter}
      onFilterChange={setTargetFilter}
      selectedAccount={selectedTarget}
      placeholder="Filtrar por código ou nome"
    />
  ), [targetFilter, selectedTarget, setTargetFilter]);

  return (
    <div className="template-list-container">
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-12 md:col-5">
          <AccountTable
            title="Contas não parametrizadas"
            data={source}
            selected={selectedSource}
            onSelectionChange={setSelectedSource}
            loading={sourceLoading}
            emptyMessage="Nenhuma conta não parametrizada encontrada"
            toolbar={<LeftToolbar />}
            header={sourceHeader}
          />
        </div>
        
        <ActionButton
          onClick={handleDePara}
          disabled={!selectedSource || !selectedTarget || loading}
          loading={loading}
        />
        
        <div className="col-12 md:col-5">
          <AccountTable
            title="Contas Padrão"
            data={target}
            selected={selectedTarget}
            onSelectionChange={setSelectedTarget}
            loading={false} // Tabela padrão não tem loading pois os dados vêm do servidor
            emptyMessage="Nenhuma conta padrão encontrada"
            toolbar={<RightToolbar />}
            header={targetHeader}
          />
        </div>
      </div>
    </div>
  );
}