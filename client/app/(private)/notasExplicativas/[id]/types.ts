export interface NotaExplicativa {
  id: string;
  number: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotasExplicativasPageProps {
  params: {
    id: string;
  };
}