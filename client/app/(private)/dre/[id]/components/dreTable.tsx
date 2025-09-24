'use client'
import { Dre, DreItem } from "../../types";

interface DreTableProps {
  data: Dre;
  year: number;
  group: string;
  formatCurrency: (value: number) => string;
}

const DreTable = ({ data, year, group, formatCurrency }: DreTableProps) => {
  const filteredDre = data.dre?.filter((item: DreItem) => item.group === group) || [];
  
  let titulo = '';
  let margemBrutaCurrent = 0;
  let margemBrutaPrevious = 0;

  // Calcular margem bruta apenas se o grupo for CUSTOS
  if (group === 'CUSTOS') {
    const custosMercadorias = data.dre.find(item => item.name === 'Custos de Mercadorias Vendidas');
    const receitaComVendasDeMercadorias = data.dre.find(item => item.name === 'Receita com vendas de Mercadorias');
    const receitaComPrestacaoDeServicos = data.dre.find(item => item.name === 'Receita com Prestação de serviços');

    if (custosMercadorias && receitaComVendasDeMercadorias && receitaComPrestacaoDeServicos) {
      // Calcular o lucro bruto
      const lucroBrutoCurrent = (custosMercadorias.totalCurrentYear * -1) + 
                               receitaComVendasDeMercadorias.totalCurrentYear + 
                               receitaComPrestacaoDeServicos.totalCurrentYear;
      
      const lucroBrutoPrevious = (custosMercadorias.totalPreviousYear * -1) + 
                                receitaComVendasDeMercadorias.totalPreviousYear + 
                                receitaComPrestacaoDeServicos.totalPreviousYear;

      // Calcular a receita total
      const receitaTotalCurrent = receitaComVendasDeMercadorias.totalCurrentYear + 
                                 receitaComPrestacaoDeServicos.totalCurrentYear;
      
      const receitaTotalPrevious = receitaComVendasDeMercadorias.totalPreviousYear + 
                                  receitaComPrestacaoDeServicos.totalPreviousYear;

      // Calcular a margem bruta (percentual)
      margemBrutaCurrent = receitaTotalCurrent !== 0 ? (lucroBrutoCurrent / receitaTotalCurrent) * 100 : 0;
      margemBrutaPrevious = receitaTotalPrevious !== 0 ? (lucroBrutoPrevious / receitaTotalPrevious) * 100 : 0;
    }
  }

  if (filteredDre.length === 0) {
    return (
      <div className="border-1 surface-border border-round p-4">
        <p className="text-color-secondary">Nenhum dado encontrado para este grupo.</p>
      </div>
    );
  }

  // Adicionar linhas totais conforme o grupo
  const enhancedDre = [...filteredDre];

  if (group === 'RECEITAS_LIQUIDAS') { 
    titulo = 'Receitas Líquidas';
    enhancedDre.push({
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
    });
  }
  else if (group === 'CUSTOS') { 
    titulo = 'Custos'; 
    enhancedDre.push(
      {
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
      },
      {
        id: 0,
        name: 'Margem Bruta (%)',
        group: 'CUSTOS',
        accountingAccounts: [],
        createdAt: '',
        updatedAt: '',
        totalCurrentYear: margemBrutaCurrent,
        totalPreviousYear: margemBrutaPrevious,
        accountingsFoundCurrentYear: 0,
        accountingsFoundPreviousYear: 0
      }
    );
  }
  else if (group === 'DESPESAS_OPERACIONAIS') { 
    titulo = 'Despesas Operacionais'; 
    enhancedDre.push({
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
    });
  }
  else if (group === 'RESULTADO_FINANCEIRO') { 
    titulo = 'Resultado Financeiro'; 
    enhancedDre.push({
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
    });
  }
  else if (group === 'IMPOSTOS') { 
    titulo = 'Impostos'; 
    enhancedDre.push({
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
    });
  }
  else { 
    titulo = 'Não agrupado'; 
  }

  // Função para formatar percentuais
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="border-1 surface-border border-round p-4">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>

      {/* Cabeçalho da tabela */}
      <div className="grid mb-2 font-semibold border-bottom-1 surface-border pb-2">
        <div className="col-6">Contas de Resultado</div>
        <div className="col-3 text-right">{year}</div>
        <div className="col-3 text-right">{year - 1}</div>
      </div>

      {/* Linhas dos itens */}
      {enhancedDre.map((item: DreItem) => (
        <div key={`${item.id}-${item.name}`} className="grid border-bottom-1 surface-border py-3">
          <div className="col-6">{item.name}</div>
          <div className="col-3 text-right text-blue-600">
            {item.name.includes('Margem Bruta') 
              ? formatPercent(item.totalCurrentYear)
              : formatCurrency(item.totalCurrentYear)
            }
          </div>
          <div className="col-3 text-right text-blue-600">
            {item.name.includes('Margem Bruta') 
              ? formatPercent(item.totalPreviousYear)
              : formatCurrency(item.totalPreviousYear)
            }
          </div>
        </div>
      ))}
    </div>
  );
}

export default DreTable;