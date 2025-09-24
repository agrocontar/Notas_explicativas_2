'use client'
import { Dre, DreItem } from "../../types";

interface DreTableProps {
  data: Dre;
  year: number;
  group: string;
  formatCurrency: (value: number) => string;
}

const DreTable = ({ data, year, group, formatCurrency }: DreTableProps) => {
  // Filtrar itens do grupo
  const filteredDre = data.dre?.filter((item: DreItem) => item.group === group) || [];
  
  if (filteredDre.length === 0) {
    return (
      <div className="border-1 surface-border border-round p-4">
        <p className="text-color-secondary">Nenhum dado encontrado para este grupo.</p>
      </div>
    );
  }

  // Cálculos principais
  const calcularResultadoOperacional = () => {
    return {
      current: data.receitaLiquida.currentBalance - data.custos.currentBalance - data.despesaOperacional.currentBalance,
      previous: data.receitaLiquida.previousBalance - data.custos.previousBalance - data.despesaOperacional.previousBalance
    };
  };

  const calcularResultadoAntesImpostos = () => {
    const resultadoOperacional = calcularResultadoOperacional();
    return {
      current: data.resultadoFinanceiro.currentBalance - resultadoOperacional.current,
      previous: data.resultadoFinanceiro.previousBalance - resultadoOperacional.previous
    };
  };

  const calcularResultadoExercicio = () => {
    const resultadoAntesImpostos = calcularResultadoAntesImpostos();

    return {
      current: resultadoAntesImpostos.current - (data.totalImpostos.currentBalance * -1), // Vem como negativo, volto para positivo para calcular
      previous: resultadoAntesImpostos.previous - (data.totalImpostos.previousBalance * -1)
    };
  };

  const calcularMargemBruta = () => {
    const custosMercadorias = data.dre.find(item => item.name === 'Custos de Mercadorias Vendidas');
    const receitaMercadorias = data.dre.find(item => item.name === 'Receita com vendas de Mercadorias');
    const receitaServicos = data.dre.find(item => item.name === 'Receita com Prestação de serviços');

    if (!custosMercadorias || !receitaMercadorias || !receitaServicos) {
      return { current: 0, previous: 0 };
    }

    // Lucro Bruto = (-Custos Mercadorias) + Receita Mercadorias + Receita Serviços
    const lucroBruto = {
      current: (custosMercadorias.totalCurrentYear * -1) + receitaMercadorias.totalCurrentYear + receitaServicos.totalCurrentYear,
      previous: (custosMercadorias.totalPreviousYear * -1) + receitaMercadorias.totalPreviousYear + receitaServicos.totalPreviousYear
    };

    // Receita Total = Receita Mercadorias + Receita Serviços
    const receitaTotal = {
      current: receitaMercadorias.totalCurrentYear + receitaServicos.totalCurrentYear,
      previous: receitaMercadorias.totalPreviousYear + receitaServicos.totalPreviousYear
    };

    // Margem Bruta (%) = (Lucro Bruto / Receita Total) * 100
    return {
      current: receitaTotal.current !== 0 ? (lucroBruto.current / receitaTotal.current) * 100 : 0,
      previous: receitaTotal.previous !== 0 ? (lucroBruto.previous / receitaTotal.previous) * 100 : 0
    };
  };

  // Função para aplicar negativo nas linhas específicas
  const aplicarNegativoSeNecessario = (item: DreItem): DreItem => {
    // Lista de linhas que devem ser exibidas como negativas
    const linhasParaNegativar = [
      'Despesas gerais e administrativas',
      'Despesas Tributárias',
      'Outras despesas',
      'Despesas financeiras',
      'IRRF a recolher/compensar',
      'CSLL a recolher/compensar'
    ];

    if (linhasParaNegativar.includes(item.name)) {
      return {
        ...item,
        totalCurrentYear: -Math.abs(item.totalCurrentYear), // Garante que seja negativo
        totalPreviousYear: -Math.abs(item.totalPreviousYear) // Garante que seja negativo
      };
    }
    
    return item;
  };

  // Configuração dos grupos
  const getGroupConfig = () => {
    const resultadoOperacional = calcularResultadoOperacional();
    const resultadoAntesImpostos = calcularResultadoAntesImpostos();
    const resultadoExercicio = calcularResultadoExercicio();
    const margemBruta = calcularMargemBruta();

    const baseConfig = {
      titulo: '',
      linhasAdicionais: [] as DreItem[]
    };

    switch (group) {
      case 'RECEITAS_LIQUIDAS':
        return {
          ...baseConfig,
          titulo: 'Receitas Líquidas',
          linhasAdicionais: [{
            id: 0, name: 'Receitas Líquidas', group,
            accountingAccounts: [], createdAt: '', updatedAt: '',
            totalCurrentYear: data.receitaLiquida.currentBalance,
            totalPreviousYear: data.receitaLiquida.previousBalance,
            accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
          }]
        };

      case 'CUSTOS':
        return {
          ...baseConfig,
          titulo: 'Custos',
          linhasAdicionais: [
            {
              id: 0, name: 'Custos', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: data.custos.currentBalance * -1,
              totalPreviousYear: data.custos.previousBalance * -1,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            },
            {
              id: 0, name: 'Margem Bruta (%)', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: margemBruta.current,
              totalPreviousYear: margemBruta.previous,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            }
          ]
        };

      case 'DESPESAS_OPERACIONAIS':
        return {
          ...baseConfig,
          titulo: 'Despesas Operacionais',
          linhasAdicionais: [
            {
              id: 0, name: 'Despesas Operacionais', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: data.despesaOperacional.currentBalance * -1,
              totalPreviousYear: data.despesaOperacional.previousBalance * -1,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            },
            {
              id: 0, name: 'Resultado Operacional', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: resultadoOperacional.current,
              totalPreviousYear: resultadoOperacional.previous,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            }
          ]
        };

      case 'RESULTADO_FINANCEIRO':
        return {
          ...baseConfig,
          titulo: 'Resultado Financeiro',
          linhasAdicionais: [
            {
              id: 0, name: 'Resultado Financeiro', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: data.resultadoFinanceiro.currentBalance,
              totalPreviousYear: data.resultadoFinanceiro.previousBalance,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            },
            {
              id: 0, name: 'Resultado Antes dos Impostos', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: resultadoAntesImpostos.current,
              totalPreviousYear: resultadoAntesImpostos.previous,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            }
          ]
        };

      case 'IMPOSTOS':
        return {
          ...baseConfig,
          titulo: 'Impostos',
          linhasAdicionais: [
            {
              id: 0, name: 'Impostos', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: data.totalImpostos.currentBalance,
              totalPreviousYear: data.totalImpostos.previousBalance,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            },
            {
              id: 0, name: 'Resultado do Exercício', group,
              accountingAccounts: [], createdAt: '', updatedAt: '',
              totalCurrentYear: resultadoExercicio.current,
              totalPreviousYear: resultadoExercicio.previous,
              accountingsFoundCurrentYear: 0, accountingsFoundPreviousYear: 0
            }
          ]
        };

      default:
        return { ...baseConfig, titulo: 'Não agrupado' };
    }
  };

  const groupConfig = getGroupConfig();
  
  // Separar a linha do título das demais linhas adicionais
  const linhaTitulo = groupConfig.linhasAdicionais.find(item => 
    item.name === groupConfig.titulo
  );
  
  const outrasLinhasAdicionais = groupConfig.linhasAdicionais.filter(item => 
    item.name !== groupConfig.titulo
  );

  // Aplicar negativo nas linhas filtradas antes de juntar
  const linhasFiltradasComNegativo = filteredDre.map(aplicarNegativoSeNecessario);
  
  // Juntar as linhas normais (com negativo aplicado) com as outras linhas adicionais
  const linhasDaTabela = [...linhasFiltradasComNegativo, ...outrasLinhasAdicionais];

  // Função para formatar percentuais
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  // Função para formatar currency com tratamento de negativo
  const formatCurrencyComNegativo = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div>
      {/* Tabela principal */}
      <div className="border-1 surface-border border-round p-4 mb-4">

        {/* Cabeçalho da tabela */}
        <div className="grid mb-2 font-semibold border-bottom-1 surface-border pb-2">
          <div className="col-6"></div>
          <div className="col-3 text-right">{year}</div>
          <div className="col-3 text-right">{year - 1}</div>
        </div>

        {/* Linha do título separada fora da tabela */}
        {linhaTitulo && (
          <div className="border-bottom-1 surface-border py-3">
            <div className="grid font-bold text-lg">
              <div className="col-6">{linhaTitulo.name}</div>
              <div className="col-3 text-right text-blue-600">
                {linhaTitulo.name.includes('Margem Bruta') 
                  ? formatPercent(linhaTitulo.totalCurrentYear)
                  : formatCurrencyComNegativo(linhaTitulo.totalCurrentYear)
                }
              </div>
              <div className="col-3 text-right text-blue-600">
                {linhaTitulo.name.includes('Margem Bruta') 
                  ? formatPercent(linhaTitulo.totalPreviousYear)
                  : formatCurrencyComNegativo(linhaTitulo.totalPreviousYear)
                }
              </div>
            </div>
          </div>
        )}

        {/* Linhas da tabela (normais + outras adicionais) */}
        {linhasDaTabela.map((item: DreItem) => (
          <div key={`${item.id}-${item.name}`} className="grid border-bottom-1 surface-border py-3">
            <div className="col-6">{item.name}</div>
            <div className="col-3 text-right text-blue-600">
              {item.name.includes('Margem Bruta') 
                ? formatPercent(item.totalCurrentYear)
                : formatCurrencyComNegativo(item.totalCurrentYear)
              }
            </div>
            <div className="col-3 text-right text-blue-600">
              {item.name.includes('Margem Bruta') 
                ? formatPercent(item.totalPreviousYear)
                : formatCurrencyComNegativo(item.totalPreviousYear)
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DreTable;