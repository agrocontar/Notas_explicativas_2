// src/components/TabelaDemonstrativa/ValorCell.tsx
import { InputNumber } from 'primereact/inputnumber';

interface ValorCellProps {
  value: number | null;
  onValueChange: (value: number | null) => void;
}

export default function ValorCell({ value, onValueChange }: ValorCellProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <InputNumber
        value={value}
        onValueChange={(e) => onValueChange(e.value || null)}
        mode="currency"
        currency="BRL"
        locale="pt-BR"
        className="w-full"
        placeholder="0,00"
        readOnly={false}
      />
    </>
  );
}