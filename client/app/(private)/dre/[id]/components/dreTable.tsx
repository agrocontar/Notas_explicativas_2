'use client'
import { Dre } from "../../types";

interface DreTableProps {
  dre: Dre[];
  year: number;
  group: string;
  formatCurrency: (value: number) => string;
}

const DreTable = ({ dre, year, group, formatCurrency }: DreTableProps) => {

  let titulo = '';
  if (group === 'RECEITAS_LIQUIDAS') { titulo = 'Receitas Líquidas'; }
  else if (group === 'CUSTOS') { titulo = 'Custos'; }
  else if (group === 'DESPESAS_OPERACIONAIS') { titulo = 'Despesas Operacionais'; }
  else if (group === 'RESULTADO_FINANCEIRO') { titulo = 'Resultado Financeiro'; }
  else if (group === 'IMPOSTOS') { titulo = 'Impostos'; }
  else { titulo = 'Não agrupado'; }

  const filteredDre = dre?.filter((item: Dre) => item.group === group) || [];

  // Calcular totais
  const totalAnoAtual = filteredDre.reduce((sum: number, item: Dre) => sum + item.totalCurrentYear, 0);
  const totalAnoAnterior = filteredDre.reduce((sum: number, item: Dre) => sum + item.totalPreviousYear, 0);

  if (filteredDre.length === 0) {
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
      {filteredDre.map((item: Dre) => (
        <div key={item.id} className="grid border-bottom-1 surface-border py-3">
          <div className="col-6">{item.name}</div>
          <div className="col-3 text-right text-blue-600">
            {formatCurrency(item.totalCurrentYear)}
          </div>
          <div className="col-3 text-right text-blue-600">
            {formatCurrency(item.totalPreviousYear)}
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

export default DreTable;