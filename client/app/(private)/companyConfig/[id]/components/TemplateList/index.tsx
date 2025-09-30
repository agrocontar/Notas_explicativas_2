'use client';
import { Toast } from 'primereact/toast';
import { useTemplateList } from './useTemplateList';
import { AccountTable } from './components/AccountTable';
import { ActionButton } from './components/ActionButton';
import { FilterHeader } from './components/FilterHeader';
import { TemplateListProps } from './types';
import { memo, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import api from '@/app/api/api';

// Defina os componentes fora do componente principal ou atribua displayName
const LeftToolbar = memo(() => (
  <div className="flex flex-column gap-2">
    <span className="text-xl font-bold">Contas não parametrizadas</span>
    <span>Selecione uma conta</span>
  </div>
));
LeftToolbar.displayName = 'LeftToolbar'; // Adicione esta linha

const RightToolbar = memo(() => (
  <div className="flex flex-column gap-2">
    <span className="text-xl font-bold">Contas Padrão</span>
    <span>Selecione uma conta</span>
  </div>
));
RightToolbar.displayName = 'RightToolbar'; // Adicione esta linha

export default function TemplateList({ companyId, initialData, onMappingCreated }: TemplateListProps) {
 const {
    source,
    target,
    selectedMultipleSources,
    selectedTarget, // Já é um único Account | null
    sourceFilter,
    targetFilter,
    sourceLoading,
    createLoading,
    deleteMultipleLoading,
    bulkMappingLoading,
    toast,
    setSourceFilter,
    setTargetFilter,
    setSelectedMultipleSources,
    setSelectedTarget, // Já é uma função que recebe Account | null
    handleBulkMapping,
    handleCreateAccount,
    handleDeleteMultipleAccounts
  } = useTemplateList(companyId, initialData);

  const [accountDialog, setAccountDialog] = useState(false);
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false); 
  const [bulkMappingDialog, setBulkMappingDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    accountingAccount: ''
  });


  // Headers memoizados - dependências corrigidas
  const sourceHeader = useMemo(() => (
    <FilterHeader
      filterValue={sourceFilter}
      onFilterChange={setSourceFilter}
      selectedAccount={selectedMultipleSources.length > 0 ? selectedMultipleSources[0] : null} // Atualizado
      placeholder="Filtrar por código ou nome"
    />
  ), [sourceFilter, selectedMultipleSources, setSourceFilter]);

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

  const openDeleteMultipleDialog = () => {
    if (selectedMultipleSources.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos uma conta para excluir',
        life: 3000
      });
      return;
    }
    setDeleteMultipleDialog(true);
  }

  const openBulkMappingDialog = () => {
    if (selectedMultipleSources.length === 0 || !selectedTarget) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos uma conta não parametrizada e uma conta padrão',
        life: 3000
      });
      return;
    }
    setBulkMappingDialog(true);
  }

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = e.target?.value || '';
    setNewAccount({ ...newAccount, [field]: val });
  };

   const deleteMultipleAccounts = async () => {
    try {
      await handleDeleteMultipleAccounts(selectedMultipleSources);
      setDeleteMultipleDialog(false);
    } catch (error) {
      console.error('Erro ao excluir contas:', error);
    }
  };

  const executeBulkMapping = async () => {
    try {
      await handleBulkMapping(selectedMultipleSources, selectedTarget!);
      setBulkMappingDialog(false);

      if (onMappingCreated) {
        onMappingCreated();
      }

    } catch (error) {
      console.error('Erro ao mapear contas:', error);
    }
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

  
    const deleteMultipleDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={() => setDeleteMultipleDialog(false)} />
      <Button 
        label={`Excluir ${selectedMultipleSources.length} conta(s)`} 
        icon="pi pi-check" 
        text 
        onClick={deleteMultipleAccounts} 
        loading={deleteMultipleLoading} 
      />
    </>
  );

  const bulkMappingDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={() => setBulkMappingDialog(false)} />
      <Button 
        label={`Mapear ${selectedMultipleSources.length} conta(s)`} 
        icon="pi pi-check" 
        text 
        onClick={executeBulkMapping} 
        loading={bulkMappingLoading} 
      />
    </>
  );

  return (
    <div className="template-list-container">
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-12 md:col-5">
          <AccountTable
            title="Contas não parametrizadas"
            data={source}
            selectedMultiple={selectedMultipleSources}
            onMultipleSelectionChange={setSelectedMultipleSources}
            loading={sourceLoading || createLoading}
            emptyMessage="Nenhuma conta não parametrizada encontrada"
            toolbar={<LeftToolbar />}
            header={sourceHeader}
            handleCreateAccount={openCreateDialog}
            handleDeleteMultipleAccounts={openDeleteMultipleDialog}
            showCheckbox={true}
          />
        </div>

        <ActionButton
          onBulkMapping={openBulkMappingDialog}
          bulkMappingDisabled={selectedMultipleSources.length === 0 || !selectedTarget}
          bulkMappingLoading={bulkMappingLoading}
          selectedMultipleCount={selectedMultipleSources.length}
        />

        <div className="col-12 md:col-5">
          <AccountTable
            title="Contas Padrão"
            data={target}
            selectedSingle={selectedTarget} // AGORA USA selectedSingle
            onSingleSelectionChange={setSelectedTarget} // AGORA USA onSingleSelectionChange
            loading={false}
            emptyMessage="Nenhuma conta padrão encontrada"
            toolbar={<RightToolbar />}
            header={targetHeader}
            showCheckbox={false}
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

       <Dialog visible={deleteMultipleDialog} style={{ width: '500px' }} header="Excluir Múltiplas Contas" modal className="p-fluid" footer={deleteMultipleDialogFooter} onHide={() => setDeleteMultipleDialog(false)}>
        <div className="field">
          <p>
            Tem certeza que deseja excluir as {selectedMultipleSources.length} contas selecionadas?
          </p>
          <div className="max-h-10rem overflow-auto border-1 surface-border border-round p-2 mt-2">
            <ul>
              {selectedMultipleSources.map(account => (
                <li key={account.id} className="text-sm mb-1">
                  <strong>{account.accountingAccount}</strong> - {account.accountName}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-500 mt-2">Esta ação não pode ser desfeita.</p>
        </div>
      </Dialog>

      <Dialog visible={bulkMappingDialog} style={{ width: '500px' }} header="Mapear Múltiplas Contas" modal className="p-fluid" footer={bulkMappingDialogFooter} onHide={() => setBulkMappingDialog(false)}>
        <div className="field">
          <p>
            Tem certeza que deseja mapear {selectedMultipleSources.length} conta(s) não parametrizadas para a conta padrão selecionada?
          </p>
          
          <div className="mb-3">
            <strong>Conta Padrão Destino:</strong>
            <div className="p-2 border-1 surface-border border-round mt-1">
              <strong>{selectedTarget?.accountingAccount}</strong> - {selectedTarget?.accountName}
            </div>
          </div>

          <strong>Contas não parametrizadas selecionadas:</strong>
          <div className="max-h-10rem overflow-auto border-1 surface-border border-round p-2 mt-1">
            <ul>
              {selectedMultipleSources.map(account => (
                <li key={account.id} className="text-sm mb-1">
                  <strong>{account.accountingAccount}</strong> - {account.accountName}
                </li>
              ))}
            </ul>
          </div>
          
          <p className="text-sm text-500 mt-2">
            Após o mapeamento, estas contas serão removidas da lista de não parametrizadas.
          </p>
        </div>
      </Dialog>

    </div>
  );
}