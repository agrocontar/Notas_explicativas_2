export interface NotaExplicativa {
  id: string;
  number: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tabelas: TabelaDemonstrativa[];
}

export interface NotasExplicativasPageProps {
  params: {
    id: string;
  };
}

export interface ContaBalancete {
  codigo: string;
  nome: string;
}

export interface TabelaDemonstrativa {
  id?: string;
  conta: string;
  anoAnterior: number | null;
  anoAtual: number | null;
  ordem: number;
}


export interface DadosBalancete {
  previousBalance: number;
  currentBalance: number;
  accountingAccount: string;
  accountName: string;
  debit?: number;
  credit?: number;
  monthBalance?: number;
}