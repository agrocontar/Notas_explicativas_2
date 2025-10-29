import { Button } from "primereact/button";

// src/components/NotasHeader.tsx
interface NotasHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
  totalNotas?: number;
}

export default function NotasHeader({ 
  onRefresh, 
  onCreateClick,
  totalNotas 
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
      <div className="flex gap-2">
        <Button
          icon="pi pi-refresh"
          className="p-button-outlined p-button-secondary"
          tooltip="Recarregar notas"
          onClick={onRefresh}
        />
        <Button
          icon="pi pi-plus"
          label="Nova Nota"
          className="p-button-primary"
          onClick={onCreateClick}
        />
      </div>
    </div>
  );
}