// src/components/TabelaDemonstrativa/TabelaHeader.tsx
import { Button } from 'primereact/button';

interface TabelaHeaderProps {
  anoAnterior: number;
  anoAtual: number;
  onAddRow: () => void;
}

export default function TabelaHeader({ anoAnterior, anoAtual, onAddRow }: TabelaHeaderProps) {
  return (
    <div className="flex justify-content-between align-items-center mb-3">
      <div>
        <h4 className="font-semibold m-0">Tabela Demonstrativa</h4>
        <small className="text-color-secondary">
          Buscando dados dos anos: {anoAnterior} (Anterior) e {anoAtual} (Atual)
        </small>
      </div>
      <Button
        icon="pi pi-plus"
        label="Adicionar Linha"
        className="p-button-outlined p-button-sm"
        onClick={onAddRow}
      />
    </div>
  );
}