'use client';
import { Button } from 'primereact/button';
import { memo } from 'react';

interface ActionButtonProps {
  onBulkMapping: () => void;
  bulkMappingDisabled: boolean;
  bulkMappingLoading: boolean;
  selectedMultipleCount: number;
}

export const ActionButton = memo(({ 
  onBulkMapping, 
  bulkMappingDisabled, 
  bulkMappingLoading,
  selectedMultipleCount = 0 
}: ActionButtonProps) => {
  return (
    <div className="col-12 md:col-2 flex flex-column align-items-center justify-content-center gap-3">
      {/* Botão de mapeamento em massa */}
      
      <Button
        icon="pi pi-arrows-h"
        className="p-button-rounded p-button-success"
        tooltip={
          bulkMappingDisabled 
            ? 'Selecione contas não parametrizadas e uma conta padrão' 
            : `Mapear ${selectedMultipleCount} conta(s) selecionada(s) para conta padrão`
        }
        tooltipOptions={{ position: 'top' }}
        onClick={onBulkMapping}
        disabled={bulkMappingDisabled}
        loading={bulkMappingLoading}
        label={`de/para ${selectedMultipleCount > 0 ? selectedMultipleCount.toString() : ''}`}
      />
      
      <span className="text-sm text-center">
        {selectedMultipleCount > 0 
          ? `${selectedMultipleCount} conta(s) selecionada(s)`
          : 'Selecione contas'
        }
      </span>
    </div>
  );
});

ActionButton.displayName = 'ActionButton';