export interface DreItem{
  id: number,
  name: string,
  group: string,
  accountingAccounts: string[],
  createdAt: string,
  updatedAt: string,
  totalCurrentYear: number,
  totalPreviousYear: number,
  accountingsFoundCurrentYear: number,
  accountingsFoundPreviousYear: number
}

export interface Dre {
  despesaOperacional: {
    currentBalance: number,
    previousBalance: number
  },
  totalImpostos: {
    currentBalance: number,
    previousBalance: number
  },
  resultadoFinanceiro: {
    currentBalance: number,
    previousBalance: number
  },
  receitaLiquida: {
    currentBalance: number,
    previousBalance: number
  },
  custos: {
    currentBalance: number,
    previousBalance: number
  },
  dre: DreItem[]
}