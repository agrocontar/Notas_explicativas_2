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
  despesaOperacional: number,
  totalImpostos: number,
  resultadoFinanceiro: number,
  receitaLiquida: number,
  custos: number,
  dre: DreItem[]
}