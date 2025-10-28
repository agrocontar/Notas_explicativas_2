import { Button } from "primereact/button";

interface NotasHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
}

export default function NotasHeader({ onRefresh, onCreateClick }: NotasHeaderProps) {
  return (
    <div className="card mb-3">
      <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-2">
        <div className="flex flex-column">
          <h1 className="text-xl font-bold m-0">Notas Explicativas</h1>
          <span className="text-sm text-color-secondary">
            Gerencie as notas explicativas da empresa
          </span>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            icon="pi pi-plus"
            label="Nova Nota"
            className="p-button-primary p-button-sm"
            onClick={onCreateClick}
          />
          <Button
            icon="pi pi-refresh"
            label="Atualizar"
            className="p-button-outlined p-button-sm"
            onClick={onRefresh}
          />
        </div>
      </div>
    </div>
  );
}