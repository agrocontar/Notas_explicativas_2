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
  onSelectionChange: (account: Account | null) => void;
  loading: boolean;
  emptyMessage: string;
  toolbar: React.ReactNode;
  header: React.ReactNode;
  handleCreateAccount?: () => void;
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
  onSelectionChange,
  loading,
  emptyMessage,
  toolbar,
  header,
  handleCreateAccount
}: AccountTableProps) => {
  return (
    <Card className="h-full">
      <Toolbar className="mb-2" left={toolbar} />
      {handleCreateAccount &&
        <div className='flex justify-content-end mb-2 my-2 gap-2'>
          <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-success p-button-sm"
            tooltip="Criar nova conta"
            tooltipOptions={{ position: 'top' }}
            onClick={handleCreateAccount}
          />

          <Button
            icon="pi pi-refresh"
            className="p-button-rounded p-button-warning p-button-sm"
            tooltip="Atualizar conta"
            tooltipOptions={{ position: 'top' }}
            onClick={handleCreateAccount}
          />

          {/* <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-sm"
            tooltip="Remover conta"
            tooltipOptions={{ position: 'top' }}
            onClick={handleCreateAccount}
          /> */}

          
        </div>
      }
      {header}
      <div className="table-container">
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
          // Configurações otimizadas para performance
          virtualScrollerOptions={{
            itemSize: 50,
            showLoader: true,
            loading: loading,
          }}
          // Otimizações de performance
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
      </div>
    </Card>
  );
});

AccountTable.displayName = 'AccountTable';