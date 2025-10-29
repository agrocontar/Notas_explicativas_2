// src/components/NotasHeader.tsx
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

interface NotasHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
  onExportClick: () => void;
  totalNotas?: number;
  exportLoading?: boolean;
}

export default function NotasHeader({ 
  onRefresh, 
  onCreateClick,
  onExportClick,
  totalNotas,
  exportLoading = false
}: NotasHeaderProps) {
  return (
    <div className="flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="text-3xl font-bold m-0">Notas Explicativas</h1>
        {totalNotas !== undefined && (
          <p className="text-color-secondary m-0 mt-1">
            {totalNotas} {totalNotas === 1 ? 'nota' : 'notas'} cadastradas
          </p>
        )}
      </div>
      
      <Tooltip target=".export-btn" />
      <Tooltip target=".refresh-btn" />
      <Tooltip target=".create-btn" />
      
      <div className="flex gap-2">
        <Button
          icon="pi pi-refresh"
          className="p-button-outlined p-button-secondary refresh-btn"
          tooltip="Recarregar notas"
          tooltipOptions={{ position: 'top' }}
          onClick={onRefresh}
        />
        
        <Button
          icon="pi pi-download"
          label="Exportar"
          className="p-button-outlined p-button-help export-btn"
          tooltip="Exportar todas as notas para Word"
          tooltipOptions={{ position: 'top' }}
          onClick={onExportClick}
          loading={exportLoading}
          disabled={exportLoading}
        />
        
        <Button
          icon="pi pi-plus"
          label="Nova Nota"
          className="p-button-primary create-btn"
          tooltip="Criar nova nota explicativa"
          tooltipOptions={{ position: 'top' }}
          onClick={onCreateClick}
        />
      </div>
    </div>
  );
}