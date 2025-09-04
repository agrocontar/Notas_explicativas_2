'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Skeleton } from 'primereact/skeleton';
import { memo } from 'react';
import { Account } from '../types';

interface AccountTableProps {
  title: string;
  data: Account[];
  selected: Account | null;
  onSelectionChange: (account: Account | null) => void;
  loading: boolean;
  emptyMessage: string;
  toolbar: React.ReactNode;
  header: React.ReactNode;
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
  header
}: AccountTableProps) => {
  return (
    <Card className="h-full">
      <Toolbar className="mb-2" left={toolbar} />
      {header}
      <div className="table-container">
        <DataTable 
          value={data} 
          selectionMode="single"
          selection={selected}
          onSelectionChange={(e) => onSelectionChange(e.value as Account)}
          dataKey="id"
          scrollable 
          scrollHeight="400px"
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