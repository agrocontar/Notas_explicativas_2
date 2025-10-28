import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { TabelaDemonstrativa as TabelaType } from '../types';
import api from '@/app/api/api';

interface TabelaDemonstrativaProps {
  notaId: string;
  tabelas: TabelaType[];
  onTabelasChange: (tabelas: TabelaType[]) => void;
}

export default function TabelaDemonstrativa({ 
  notaId, 
  tabelas, 
  onTabelasChange 
}: TabelaDemonstrativaProps) {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

  // Carregar tabelas quando o componente montar
  useEffect(() => {
    fetchTabelas();
  }, [notaId]);

  const fetchTabelas = async () => {
    if (!notaId) return;
    
    try {
      setLoading(true);
      const res = await api.get(`tabelas/nota/${notaId}/tabelas`);
      if (res.status === 200) {
        onTabelasChange(res.data);
      }
    } catch (error) {
      console.error('Erro ao carregar tabelas:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar a tabela demonstrativa.',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => {
  try {
    const novaOrdem = tabelas.length > 0 ? Math.max(...tabelas.map(t => t.ordem)) + 1 : 1;
    
    const res = await api.post(`tabelas/nota/${notaId}/tabelas`, {
      conta: '',
      anoAnterior: null,
      anoAtual: null,
      ordem: novaOrdem
    });

    if (res.status === 201) {
      const novasTabelas = [...tabelas, res.data];
      onTabelasChange(novasTabelas); // Chama a função de callback para atualizar o estado pai
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
};

// E também atualize a handleDeleteRow:
const handleDeleteRow = (id: string) => {
  confirmDialog({
    message: 'Tem certeza que deseja deletar esta linha?',
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptClassName: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`tabelas/tabelas/${id}`);
        const updatedTabelas = tabelas.filter(t => t.id !== id);
        onTabelasChange(updatedTabelas); // Chama a função de callback
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
    },
    rejectClassName: 'p-button-secondary p-button-text',
  });
};

  const handleUpdateRow = async (id: string, field: string, value: any) => {
    try {
      const updatedTabelas = tabelas.map(tabela =>
        tabela.id === id ? { ...tabela, [field]: value } : tabela
      );
      onTabelasChange(updatedTabelas);

      // Debounce para evitar muitas requisições
      setTimeout(async () => {
        await api.put(`tabelas/tabelas/${id}`, { [field]: value });
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
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center p-4">
        <i className="pi pi-spin pi-spinner mr-2"></i>
        Carregando tabela...
      </div>
    );
  }

  return (
    <div className="tabela-demonstrativa">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center mb-3">
        <h4 className="font-semibold m-0">Tabela Demonstrativa</h4>
        <Button
          icon="pi pi-plus"
          label="Adicionar Linha"
          className="p-button-outlined p-button-sm"
          onClick={handleAddRow}
        />
      </div>

      <div className="card">
        <div className="p-datatable p-component">
          <div className="p-datatable-wrapper">
            <table className="p-datatable-table w-full">
              <thead>
                <tr>
                  <th className="p-column-header" style={{ width: '40%' }}>
                    <span className="p-column-title">Conta</span>
                  </th>
                  <th className="p-column-header text-right" style={{ width: '25%' }}>
                    <span className="p-column-title">Ano Anterior</span>
                  </th>
                  <th className="p-column-header text-right" style={{ width: '25%' }}>
                    <span className="p-column-title">Ano Atual</span>
                  </th>
                  <th className="p-column-header" style={{ width: '10%' }}>
                    <span className="p-column-title">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tabelas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-color-secondary">
                      Nenhuma linha adicionada. Clique em "Adicionar Linha" para começar.
                    </td>
                  </tr>
                ) : (
                  tabelas.map((linha, index) => (
                    <tr key={linha.id || index} className="p-datatable-row">
                      <td className="p-datatable-cell">
                        <InputText
                          value={linha.conta}
                          onChange={(e) => handleUpdateRow(linha.id!, 'conta', e.target.value)}
                          placeholder="Nome da conta"
                          className="w-full"
                        />
                      </td>
                      <td className="p-datatable-cell text-right">
                        <InputNumber
                          value={linha.anoAnterior}
                          onValueChange={(e) => handleUpdateRow(linha.id!, 'anoAnterior', e.value)}
                          mode="currency"
                          currency="BRL"
                          locale="pt-BR"
                          className="w-full"
                          placeholder="0,00"
                        />
                      </td>
                      <td className="p-datatable-cell text-right">
                        <InputNumber
                          value={linha.anoAtual}
                          onValueChange={(e) => handleUpdateRow(linha.id!, 'anoAtual', e.value)}
                          mode="currency"
                          currency="BRL"
                          locale="pt-BR"
                          className="w-full"
                          placeholder="0,00"
                        />
                      </td>
                      <td className="p-datatable-cell">
                        <div className="flex justify-content-center">
                          <Button
                            icon="pi pi-trash"
                            className="p-button-text p-button-danger p-button-sm"
                            onClick={() => handleDeleteRow(linha.id!)}
                            tooltip="Deletar linha"
                            tooltipOptions={{ position: 'top' }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}