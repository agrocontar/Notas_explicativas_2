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

export interface TabelaDemonstrativa {
  id?: string;
  conta: string;
  anoAnterior: number | null;
  anoAtual: number | null;
  ordem: number;
}