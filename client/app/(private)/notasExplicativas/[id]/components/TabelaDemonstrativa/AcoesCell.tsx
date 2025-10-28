// src/components/TabelaDemonstrativa/AcoesCell.tsx
import { Button } from 'primereact/button';

interface AcoesCellProps {
  onDelete: () => void;
}

export default function AcoesCell({ onDelete }: AcoesCellProps) {
  return (
    <div className="flex justify-content-center">
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-danger p-button-sm"
        onClick={onDelete}
        tooltip="Deletar linha"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );
}