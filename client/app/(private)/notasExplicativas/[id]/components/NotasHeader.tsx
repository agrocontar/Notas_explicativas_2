import { Button } from "primereact/button";

interface NotasHeaderProps {
  onRefresh: () => void;
}

export default function NotasHeader({ onRefresh }: NotasHeaderProps) {
  return (
    <div className="card mb-3">
      <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-2">
        <div className="flex flex-column">
          <h1 className="text-xl font-bold m-0">Notas Explicativas</h1>
          <span className="text-sm text-color-secondary">
            Gerencie as notas explicativas da empresa
          </span>
        </div>

        <Button
          icon="pi pi-refresh"
          label="Atualizar"
          className="p-button-outlined flex-shrink-0 p-button-sm"
          onClick={onRefresh}
        />
      </div>
    </div>
  );
}