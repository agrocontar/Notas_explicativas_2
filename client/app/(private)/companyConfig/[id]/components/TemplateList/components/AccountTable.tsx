'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Skeleton } from 'primereact/skeleton';
import { memo } from 'react';
import { Account } from '../types';
import { Button } from 'primereact/button';

interface AccountTableProps {
  title: string;
  data: Account[];
  selected: Account | null;
  selectedMultiple?: Account[];
  onSelectionChange: (account: Account | null) => void;
  onMultipleSelectionChange?: (accounts: Account[]) => void;
  loading: boolean;
  emptyMessage: string;
  toolbar: React.ReactNode;
  header: React.ReactNode;
  handleCreateAccount?: () => void;
  handleDeleteMultipleAccounts?: () => void;
  showCheckbox?: boolean;
}

const accountTemplate = (rowData: Account) => {
  return (
    <div className="flex flex-column">
      <span className="font-bold">{rowData.accountingAccount}</span>
      <span className="text-sm">{rowData.accountName}</span>
    </div>
  );
};

const loadingTemplate = () => {
  return (
    <div className="flex flex-column">
      <Skeleton width="80%" height="1rem" className="mb-2" />
      <Skeleton width="60%" height="0.8rem" />
    </div>
  );
};

// Componente memoizado igual para ambas as tabelas
export const AccountTable = memo(({
  title,
  data,
  selected,
  selectedMultiple = [],
  onSelectionChange,
  onMultipleSelectionChange,
  loading,
  emptyMessage,
  toolbar,
  header,
  handleCreateAccount,
  handleDeleteMultipleAccounts,
  showCheckbox = false
}: AccountTableProps) => {

  // Botão para deletar múltiplas contas
  const MultipleDeleteButton = () => (
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger p-button-sm"
      tooltip={`Excluir ${selectedMultiple.length} conta(s) selecionada(s)`}
      tooltipOptions={{ position: 'top' }}
      onClick={handleDeleteMultipleAccounts}
      disabled={!selectedMultiple || selectedMultiple.length === 0}
    />
  );

  // CORREÇÃO: Renderizar DataTable condicionalmente baseado no modo de seleção
  const renderDataTable = () => {
    if (showCheckbox) {
      // Modo múltipla seleção (com checkbox)
      return (
        <DataTable
          value={data}
          selectionMode="multiple"
          selection={selectedMultiple}
          onSelectionChange={(e) => onMultipleSelectionChange?.(e.value as Account[])}
          dataKey="id"
          scrollable
          scrollHeight="300px"
          loading={loading}
          className="p-datatable-sm"
          emptyMessage={emptyMessage}
          virtualScrollerOptions={{
            itemSize: 50,
            showLoader: true,
            loading: loading,
          }}
          resizableColumns
          columnResizeMode="fit"
          showGridlines
          size="small"
        >
          <Column 
            selectionMode="multiple" 
            headerStyle={{ width: '3rem' }}
          />
          <Column
            body={loading ? loadingTemplate : accountTemplate}
            header="Conta"
            style={{ minWidth: '200px' }}
          />
        </DataTable>
      );
    } else {
      // Modo seleção única (sem checkbox)
      return (
        <DataTable
          value={data}
          selectionMode="single"
          selection={selected}
          onSelectionChange={(e) => onSelectionChange(e.value as Account)}
          dataKey="id"
          scrollable
          scrollHeight="300px"
          loading={loading}
          className="p-datatable-sm"
          emptyMessage={emptyMessage}
          virtualScrollerOptions={{
            itemSize: 50,
            showLoader: true,
            loading: loading,
          }}
          resizableColumns
          columnResizeMode="fit"
          showGridlines
          size="small"
        >
          <Column
            body={loading ? loadingTemplate : accountTemplate}
            header="Conta"
            style={{ minWidth: '200px' }}
          />
        </DataTable>
      );
    }
  };

  return (
    <Card className="h-full">
      <Toolbar className="mb-2" left={toolbar} />
      {(handleCreateAccount || handleDeleteMultipleAccounts) && (
        <div className='flex justify-content-end mb-2 my-2 gap-2'>
          {handleCreateAccount && (
            <Button
              icon="pi pi-plus"
              className="p-button-rounded p-button-success p-button-sm"
              tooltip="Criar nova conta"
              tooltipOptions={{ position: 'top' }}
              onClick={handleCreateAccount}
            />
          )}

          {handleDeleteMultipleAccounts && showCheckbox && (
            <MultipleDeleteButton />
          )}
        </div>
      )}
      {header}
      <div className="table-container">
        {renderDataTable()}
      </div>
    </Card>
  );
});

AccountTable.displayName = 'AccountTable';