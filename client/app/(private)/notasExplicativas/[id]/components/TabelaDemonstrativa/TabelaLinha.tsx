// src/components/TabelaDemonstrativa/TabelaLinha.tsx
import { TabelaDemonstrativa as TabelaType, ContaBalancete } from '../../types';
import ContaDropdown from './ContaDropdown';
import ValorCell from './ValorCell';
import AcoesCell from './AcoesCell';

interface TabelaLinhaProps {
  linha: TabelaType;
  contasBalancete: ContaBalancete[];
  loadingContas: boolean;
  onContaSelect: (id: string, codigoConta: string) => void;
  onUpdateRow: (id: string, field: string, value: any) => void;
  onDeleteRow: (id: string) => void;
}

export default function TabelaLinha({
  linha,
  contasBalancete,
  loadingContas,
  onContaSelect,
  onUpdateRow,
  onDeleteRow
}: TabelaLinhaProps) {
  return (
    <tr className="p-datatable-row">
      <td className="p-datatable-cell">
        <ContaDropdown
          linha={linha}
          contasBalancete={contasBalancete}
          loadingContas={loadingContas}
          onContaSelect={onContaSelect}
        />
      </td>
      <td className="p-datatable-cell text-right">
        <ValorCell
          value={linha.anoAnterior}
          onValueChange={(value) => onUpdateRow(linha.id!, 'anoAnterior', value)}
        />
      </td>
      <td className="p-datatable-cell text-right">
        <ValorCell
          value={linha.anoAtual}
          onValueChange={(value) => onUpdateRow(linha.id!, 'anoAtual', value)}
        />
      </td>
      <td className="p-datatable-cell">
        <AcoesCell onDelete={() => onDeleteRow(linha.id!)} />
      </td>
    </tr>
  );
}