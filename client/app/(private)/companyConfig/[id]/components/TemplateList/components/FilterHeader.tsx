'use client';
import { InputText } from 'primereact/inputtext';
import { Account } from '../types';
import { memo } from 'react';

interface FilterHeaderProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
  selectedAccount: Account | null;
  placeholder: string;
}

export const FilterHeader = memo(({
  filterValue,
  onFilterChange,
  selectedAccount,
  placeholder
}: FilterHeaderProps) => {
  return (
    <div className="flex justify-content-between align-items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText 
          value={filterValue} 
          onChange={(e) => onFilterChange(e.target.value)} 
          placeholder={placeholder}
          className="p-inputtext-sm"
          style={{ width: '250px' }}
        />
      </span>
      <span className="text-sm">
        {selectedAccount ? `Selecionado: ${selectedAccount.accountingAccount}` : 'Nenhuma conta selecionada'}
      </span>
    </div>
  );
});

FilterHeader.displayName = 'FilterHeader';