// src/components/TabelaDemonstrativa/hooks/useTabelaDemonstrativa.ts
import { useState, useCallback } from 'react';
import { Toast } from 'primereact/toast';
import { TabelaDemonstrativa as TabelaType, ContaBalancete, DadosBalancete } from '../../types';
import api from '@/app/api/api';

interface UseTabelaDemonstrativaProps {
  notaId: string;
  tabelas: TabelaType[];
  onTabelasChange: (tabelas: TabelaType[]) => void;
  companyId: string;
  toast: React.RefObject<Toast>;
}

export const useTabelaDemonstrativa = ({
  notaId,
  tabelas,
  onTabelasChange,
  companyId,
  toast
}: UseTabelaDemonstrativaProps) => {
  const [loading, setLoading] = useState(false);
  const [contasBalancete, setContasBalancete] = useState<ContaBalancete[]>([]);
  const [loadingContas, setLoadingContas] = useState(false);
  const [anoAtual] = useState<number>(new Date().getFullYear());
  const [anoAnterior] = useState<number>(new Date().getFullYear() - 1);

  const fetchContasBalancete = useCallback(async () => {
    if (!companyId) return;
    
    try {
      setLoadingContas(true);
      const res = await api.get(`/balancete/${companyId}/contas`);
      
      if (res.status === 200) {
        setContasBalancete(res.data);
      }
    } catch (error) {
      console.error('Erro ao carregar contas do balancete:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar contas do balancete.',
        life: 3000,
      });
    } finally {
      setLoadingContas(false);
    }
  }, [companyId, toast]);

  const buscarDadosBalancete = useCallback(async (codigoConta: string, ano: number): Promise<DadosBalancete | null> => {
    try {
      const res = await api.get(`/balancete/${companyId}/${ano}/${codigoConta}`);
      
      if (res.status === 200 && res.data) {
        return res.data;
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar dados do balancete para conta ${codigoConta} no ano ${ano}:`, error);
      return null;
    }
  }, [companyId]);

  const handleContaSelect = useCallback(async (id: string, codigoConta: string) => {
    if (!codigoConta) return;

    try {
      toast.current?.show({
        severity: 'info',
        summary: 'Buscando dados...',
        detail: `Buscando valores da conta ${codigoConta}`,
        life: 2000,
      });

      const [dadosAnoAtual, dadosAnoAnterior] = await Promise.all([
        buscarDadosBalancete(codigoConta, anoAtual),
        buscarDadosBalancete(codigoConta, anoAnterior)
      ]);

      const updatedTabelas = tabelas.map(tabela => {
        if (tabela.id === id) {
          return {
            ...tabela,
            conta: codigoConta,
            anoAtual: dadosAnoAtual ? Number(dadosAnoAtual.currentBalance) : null,
            anoAnterior: dadosAnoAnterior ? Number(dadosAnoAnterior.currentBalance) : null
          };
        }
        return tabela;
      });

      onTabelasChange(updatedTabelas);

      await api.put(`demoTable/${id}`, {
        conta: codigoConta,
        anoAtual: dadosAnoAtual ? Number(dadosAnoAtual.currentBalance) : null,
        anoAnterior: dadosAnoAnterior ? Number(dadosAnoAnterior.currentBalance) : null
      });

      const contaSelecionada = contasBalancete.find(conta => conta.codigo === codigoConta);
      
      if (contaSelecionada) {
        let mensagem = `Conta ${codigoConta} - ${contaSelecionada.nome} selecionada`;
        
        if (dadosAnoAtual || dadosAnoAnterior) {
          mensagem += `. Valores carregados automaticamente do balancete.`;
        } else {
          mensagem += `. Nenhum dado encontrado no balancete para os anos ${anoAnterior}/${anoAtual}.`;
        }

        toast.current?.show({
          severity: dadosAnoAtual || dadosAnoAnterior ? 'success' : 'warn',
          summary: dadosAnoAtual || dadosAnoAnterior ? 'Dados Carregados' : 'Dados Não Encontrados',
          detail: mensagem,
          life: 4000,
        });
      }

    } catch (error) {
      console.error('Erro ao buscar dados da conta:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao buscar dados do balancete para esta conta.',
        life: 4000,
      });
    }
  }, [buscarDadosBalancete, tabelas, onTabelasChange, contasBalancete, anoAtual, anoAnterior, toast]);

  const handleAddRow = useCallback(async () => {
    try {
      const novaOrdem = tabelas.length > 0 ? Math.max(...tabelas.map(t => t.ordem)) + 1 : 1;
      
      const res = await api.post(`demoTable/${notaId}`, {
        conta: '',
        anoAnterior: null,
        anoAtual: null,
        ordem: novaOrdem
      });

      if (res.status === 201) {
        const novasTabelas = [...tabelas, res.data];
        onTabelasChange(novasTabelas);
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Nova linha adicionada.',
          life: 2000,
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar linha:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao adicionar nova linha.',
        life: 3000,
      });
    }
  }, [notaId, tabelas, onTabelasChange, toast]);

  const handleDeleteRow = useCallback((id: string) => {
    const deleteRow = async () => {
      try {
        await api.delete(`demoTable/${id}`);
        const updatedTabelas = tabelas.filter(t => t.id !== id);
        onTabelasChange(updatedTabelas);
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Linha deletada com sucesso.',
          life: 2000,
        });
      } catch (error) {
        console.error('Erro ao deletar linha:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar a linha.',
          life: 3000,
        });
      }
    };

    // Você pode usar confirmDialog aqui ou passar a confirmação para o componente pai
    deleteRow();
  }, [tabelas, onTabelasChange, toast]);

  const handleUpdateRow = useCallback(async (id: string, field: string, value: any) => {
    try {
      const updatedTabelas = tabelas.map(tabela =>
        tabela.id === id ? { ...tabela, [field]: value } : tabela
      );
      onTabelasChange(updatedTabelas);

      setTimeout(async () => {
        await api.put(`demoTable/${id}`, { [field]: value });
      }, 500);
    } catch (error) {
      console.error('Erro ao atualizar linha:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar a linha.',
        life: 3000,
      });
    }
  }, [tabelas, onTabelasChange, toast]);

  return {
    loading,
    contasBalancete,
    loadingContas,
    anoAtual,
    anoAnterior,
    fetchContasBalancete,
    handleAddRow,
    handleDeleteRow,
    handleUpdateRow,
    handleContaSelect
  };
};