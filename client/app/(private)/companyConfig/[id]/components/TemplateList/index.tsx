'use client';
import { Toast } from 'primereact/toast';
import { useTemplateList } from './useTemplateList';
import { AccountTable } from './components/AccountTable';
import { ActionButton } from './components/ActionButton';
import { FilterHeader } from './components/FilterHeader';
import { TemplateListProps } from './types';
import './TemplateList.css';
import { memo, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

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
    createLoading,
    toast,
    setSourceFilter,
    setTargetFilter,
    setSelectedSource,
    setSelectedTarget,
    handleDePara,
    handleCreateAccount
  } = useTemplateList(companyId, initialData);

  const [accountDialog, setAccountDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    accountingAccount: ''
  });

  // Headers memoizados - com botão de criação apenas na tabela de não parametrizadas
  const sourceHeader = useMemo(() => (
    <FilterHeader
      filterValue={sourceFilter}
      onFilterChange={setSourceFilter}
      selectedAccount={selectedSource}
      placeholder="Filtrar por código ou nome"
    />
  ), [sourceFilter, selectedSource, setSourceFilter, handleCreateAccount]);

  const targetHeader = useMemo(() => (
    <FilterHeader
      filterValue={targetFilter}
      onFilterChange={setTargetFilter}
      selectedAccount={selectedTarget}
      placeholder="Filtrar por código ou nome"
    />
  ), [targetFilter, selectedTarget, setTargetFilter]);

  const openCreateDialog = () => {
    // Lógica para abrir o diálogo de criação
    setAccountDialog(true);
  }

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

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = e.target?.value || '';
    setNewAccount({ ...newAccount, [field]: val });
  };

  const saveAccount = async () => {
    setSubmitted(true);
    
    // Validação
    if (!newAccount.name.trim() || !newAccount.accountingAccount.trim()) {
      return;
    }

    try {
      await handleCreateAccount({
        accountName: newAccount.name,
        accountingAccount: newAccount.accountingAccount
      });
      
      hideDialog();
      
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

   const hideDialog = () => {
    setAccountDialog(false);
    setSubmitted(false);
  };

  const dialogFooter = (
    <div>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        className="p-button-text" 
        onClick={hideDialog} 
      />
      <Button 
        label="Salvar" 
        icon="pi pi-check" 
        className="p-button-success" 
        onClick={saveAccount} 
        loading={createLoading}
      />
    </div>
  );
  

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
            loading={sourceLoading || createLoading}
            emptyMessage="Nenhuma conta não parametrizada encontrada"
            toolbar={<LeftToolbar />}
            header={sourceHeader}
            handleCreateAccount={openCreateDialog}
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
            loading={false}
            emptyMessage="Nenhuma conta padrão encontrada"
            toolbar={<RightToolbar />}
            header={targetHeader}
          />
        </div>
      </div>

      <Dialog 
        visible={accountDialog} 
        style={{ width: '450px' }} 
        header="Criar Nova Conta" 
        modal 
        className="p-fluid" 
        footer={dialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name">Nome da Conta</label>
          <InputText
            id="name"
            value={newAccount.name}
            onChange={(e) => onInputChange(e, 'name')}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !newAccount.name })}
          />
          {submitted && !newAccount.name && (
            <small className="p-error">Nome é obrigatório.</small>
          )}
        </div>
        
        <div className="field">
          <label htmlFor="accountingAccount">Código da Conta</label>
          <InputText
            id="accountingAccount"
            value={newAccount.accountingAccount}
            onChange={(e) => onInputChange(e, 'accountingAccount')}
            required
            maxLength={10}
            className={classNames({ 'p-invalid': submitted && !newAccount.accountingAccount })}
          />
          {submitted && !newAccount.accountingAccount && (
            <small className="p-error">Código da conta é obrigatório.</small>
          )}
        </div>
      </Dialog>

      
    </div>
  );
}