'use client'
import { Balanco } from "../../types";

interface BalancoTableProps {
  balances: Balanco[];
  year: number;
  group: string;
  formatCurrency: (value: number) => string;
}

const BalancoTable = ({ balances, year, group, formatCurrency }: BalancoTableProps) => {
  console.log('balances no table', balances);

  let titulo = '';
  if (group === 'ATIVO_CIRCULANTE') { titulo = 'Ativo Circulante'; }
  else if (group === 'ATIVO_NAO_CIRCULANTE') { titulo = 'Ativo Não Circulante'; }
  else if (group === 'PASSIVO_CIRCULANTE') { titulo = 'Passivo Circulante'; }
  else if (group === 'PASSIVO_NAO_CIRCULANTE') { titulo = 'Passivo Não Circulante'; }
  else if (group === 'PATRIMONIO_LIQUIDO') { titulo = 'Patrimônio Líquido'; }
  else { titulo = 'Não agrupado'; }

  const filteredBalances = balances?.filter((bal: Balanco) => bal.group === group) || [];

  // Calcular totais
  const totalAnoAtual = filteredBalances.reduce((sum: number, bal: Balanco) => sum + bal.totalCurrentYear, 0);
  const totalAnoAnterior = filteredBalances.reduce((sum: number, bal: Balanco) => sum + bal.totalPreviousYear, 0);

  if (filteredBalances.length === 0) {
    return (
      <div className="border-1 surface-border border-round p-4">
        <h3 className="text-lg font-medium mb-3">{titulo}</h3>
        <p className="text-color-secondary">Nenhum dado encontrado para este grupo.</p>
      </div>
    );
  }

  return (
    <div className="border-1 surface-border border-round p-4">
      <h3 className="text-lg font-medium mb-4">{titulo}</h3>

      {/* Cabeçalho da tabela */}
      <div className="grid mb-2 font-semibold border-bottom-1 surface-border pb-2">
        <div className="col-6">Nomenclatura</div>
        <div className="col-3 text-right">{year}</div>
        <div className="col-3 text-right">{year - 1}</div>
      </div>

      {/* Linhas dos itens */}
      {filteredBalances.map((balanco: Balanco) => (
        <div key={balanco.id} className="grid border-bottom-1 surface-border py-3">
          <div className="col-6">{balanco.name}</div>
          <div className="col-3 text-right text-blue-600">
            {formatCurrency(balanco.totalCurrentYear)}
          </div>
          <div className="col-3 text-right text-blue-600">
            {formatCurrency(balanco.totalPreviousYear)}
          </div>
        </div>
      ))}

      {/* Linha de totais */}
      <div className="grid font-bold pt-3 border-top-2 surface-border mt-2">
        <div className="col-6">Total {titulo}</div>
        <div className="col-3 text-right text-blue-600">
          {formatCurrency(totalAnoAtual)}
        </div>
        <div className="col-3 text-right text-blue-600">
          {formatCurrency(totalAnoAnterior)}
        </div>
      </div>

    </div>
  );
}

export default BalancoTable;