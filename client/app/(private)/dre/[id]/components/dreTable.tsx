'use client'
import { Dre, DreItem } from "../../types";

interface DreTableProps {
  data: Dre;
  year: number;
  group: string;
  formatCurrency: (value: number) => string;
}

const DreTable = ({ data, year, group, formatCurrency }: DreTableProps) => {
  let titulo = '';

  const filteredDre = data.dre?.filter((item: DreItem) => item.group === group) || [];
  if (filteredDre.length === 0) {
    return (
      <div className="border-1 surface-border border-round p-4">
        <p className="text-color-secondary">Nenhum dado encontrado para este grupo.</p>
      </div>
    );
  }

  
  if (group === 'RECEITAS_LIQUIDAS') { 
    titulo = 'Receitas Líquidas';
    filteredDre.push({
      id: 0,
      name: 'Receitas Líquidas',
      group: 'RECEITAS_LIQUIDAS',
      accountingAccounts: [],
      createdAt: '',
      updatedAt: '',
      totalCurrentYear: data.receitaLiquida,
      totalPreviousYear: 0,
      accountingsFoundCurrentYear: 0,
      accountingsFoundPreviousYear: 0
    })
  }
  else if (group === 'CUSTOS') { 
    titulo = 'Custos'; 
    filteredDre.push({
      id: 0,
      name: 'Custos',
      group: 'CUSTOS',
      accountingAccounts: [],
      createdAt: '',
      updatedAt: '',
      totalCurrentYear: data.custos,
      totalPreviousYear: 0,
      accountingsFoundCurrentYear: 0,
      accountingsFoundPreviousYear: 0
    })
  }
  else if (group === 'DESPESAS_OPERACIONAIS') { 
    titulo = 'Despesas Operacionais'; 
    filteredDre.push({
      id: 0,
      name: 'Despesas Operacionais',
      group: 'DESPESAS_OPERACIONAIS',
      accountingAccounts: [],
      createdAt: '',
      updatedAt: '',
      totalCurrentYear: data.despesaOperacional,
      totalPreviousYear: 0,
      accountingsFoundCurrentYear: 0,
      accountingsFoundPreviousYear: 0
    })
  }
  else if (group === 'RESULTADO_FINANCEIRO') { 
    titulo = 'Resultado Financeiro'; 
    filteredDre.push({
      id: 0,
      name: 'Resultado Financeiro',
      group: 'RESULTADO_FINANCEIRO',
      accountingAccounts: [],
      createdAt: '',
      updatedAt: '',
      totalCurrentYear: data.resultadoFinanceiro,
      totalPreviousYear: 0,
      accountingsFoundCurrentYear: 0,
      accountingsFoundPreviousYear: 0
    })
  }
  else if (group === 'IMPOSTOS') { 
    titulo = 'Impostos'; 
    filteredDre.push({
      id: 0,
      name: 'Impostos',
      group: 'IMPOSTOS',
      accountingAccounts: [],
      createdAt: '',
      updatedAt: '',
      totalCurrentYear: data.totalImpostos,
      totalPreviousYear: 0,
      accountingsFoundCurrentYear: 0,
      accountingsFoundPreviousYear: 0
    })
  }
  else { 
    titulo = 'Não agrupado'; 
    
  }
  

  return (
    <div className="border-1 surface-border border-round p-4">

      {/* Cabeçalho da tabela */}
      <div className="grid mb-2 font-semibold border-bottom-1 surface-border pb-2">
        <div className="col-6">Contas de Resultado</div>
        <div className="col-3 text-right">{year}</div>
        <div className="col-3 text-right">{year - 1}</div>
      </div>

      {/* Linhas dos itens */}
      {filteredDre.map((item: DreItem) => (
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


    </div>
  );
}

export default DreTable;