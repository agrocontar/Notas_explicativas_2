'use client';
import api from "@/app/api/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";

interface MappingTableProps {
  companyId: string;
  onMappingsDeleted?: (deletedAccounts: string[]) => void; // NOVO: Callback para quando mapeamentos são deletados
}

interface Mapping {
  id: number;
  companyId: string;
  companyAccount: string;
  defaultAccountId: number;
  company: {
    id: string;
    name: string;
    cnpj: string;
    createdAt: string;
  };
  defaultAccount: {
    id: number;
    accountingAccount: string;
    accountName: string;
    createdAt: string;
  }
}

export default function MappingTable({ companyId, onMappingsDeleted }: MappingTableProps) {
  const [mappingData, setMappingData] = useState<Mapping[]>([]);
  const [selectedMappings, setSelectedMappings] = useState<Mapping[]>([]);
  const [emptyMessage, setEmptyMessage] = useState('Nenhum mapeamento encontrado.');
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false);
  const [deleteMultipleLoading, setDeleteMultipleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const toast = useRef<Toast>(null);

  // fetchMappings com useCallback
  const fetchMappings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/config/mapping/${companyId}`);
      const data = await res.data;

      if (!res.status) {
        console.error('Erro ao buscar os Mapeamentos:', data.error);
        return;
      }

      setMappingData(data);
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao carregar mapeamentos',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchMappings();
  }, [companyId, fetchMappings]);

  // Função para deletar múltiplos mapeamentos
  const deleteMultipleMappingsHandler = async () => {
    if (selectedMappings.length === 0) return;
    
    setDeleteMultipleLoading(true);
    try {
      const mappingIds = selectedMappings.map(mapping => mapping.id);
      
      // Chamada direta à API igual ao fetch
      const res = await api.delete(`/config/mappings/bulk`, {
        data: { mappingIds }
      });

      if (res.status) {
        // Extrair as contas que foram desmapeadas (para atualizar o TemplateList)
        const deletedAccounts = selectedMappings.map(mapping => mapping.companyAccount);
        
        // Remover os mapeamentos deletados da lista
        setMappingData(prev => prev.filter(item => !mappingIds.includes(item.id)));
        setDeleteMultipleDialog(false);
        setSelectedMappings([]);
        
        // NOVO: Chamar o callback para notificar o componente pai
        if (onMappingsDeleted) {
          onMappingsDeleted(deletedAccounts);
        }
        
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${selectedMappings.length} mapeamento(s) excluído(s) com sucesso`,
          life: 3000
        });
      } else {
        throw new Error(res.data?.error || 'Erro ao excluir mapeamentos');
      }
    } catch (error: any) {
      console.error('Erro ao excluir mapeamentos:', error);
      
      let errorMessage = 'Falha ao excluir mapeamentos';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
        life: 5000
      });
    } finally {
      setDeleteMultipleLoading(false);
    }
  };

  const companyAccount = (rowData: Mapping) => {
    return (
      <div className="flex flex-column">
        <span className="font-bold">{rowData.companyAccount}</span>
      </div>
    );
  }

  const defaultAccount = (rowData: Mapping) => {
    return (
      <div className="flex flex-column">
        <span className="font-bold">{rowData.defaultAccount.accountingAccount}</span>
        <span className="text-sm">{rowData.defaultAccount.accountName}</span>
      </div>
    );
  }

  const arrowIcon = () => {
    return (
      <span className="pi pi-arrow-right" />
    );
  }

  // Botão para deletar múltiplos mapeamentos
  const MultipleDeleteButton = () => (
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger p-button-sm"
      tooltip={`Excluir ${selectedMappings.length} mapeamento(s) selecionado(s)`}
      tooltipOptions={{ position: 'top' }}
      onClick={() => setDeleteMultipleDialog(true)}
      disabled={selectedMappings.length === 0}
    />
  );

  const deleteMultipleDialogFooter = (
    <>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        text 
        onClick={() => setDeleteMultipleDialog(false)} 
        disabled={deleteMultipleLoading}
      />
      <Button 
        label={`Excluir ${selectedMappings.length} mapeamento(s)`} 
        icon="pi pi-check" 
        text 
        onClick={deleteMultipleMappingsHandler} 
        loading={deleteMultipleLoading} 
      />
    </>
  );

  return(
    <>
      <Toast ref={toast} />
      
      {/* Botão para deletar múltiplos */}
      <div className="flex justify-content-end mb-3">
        <MultipleDeleteButton />
      </div>

      <DataTable
        value={mappingData}
        selectionMode="multiple"
        selection={selectedMappings}
        onSelectionChange={(e) => setSelectedMappings(e.value as Mapping[])}
        dataKey="id"
        scrollable
        scrollHeight="400px"
        className="p-datatable-sm"
        emptyMessage={emptyMessage}
        loading={loading}
      >
        <Column 
          selectionMode="multiple" 
          headerStyle={{ width: '3rem' }}
        />
        <Column body={companyAccount} header="Conta Parametrizada" style={{ minWidth: '100px' }} />
        <Column body={arrowIcon} header="" style={{ minWidth: '50px' }} />
        <Column body={defaultAccount} header="Conta Padrão" style={{ minWidth: '200px' }} />
      </DataTable>

      {/* Diálogo para deletar múltiplos mapeamentos */}
      <Dialog 
        visible={deleteMultipleDialog} 
        style={{ width: '500px' }} 
        header="Excluir Múltiplos Mapeamentos" 
        modal 
        className="p-fluid" 
        footer={deleteMultipleDialogFooter} 
        onHide={() => !deleteMultipleLoading && setDeleteMultipleDialog(false)}
      >
        <div className="field">
          <p>Tem certeza que deseja excluir {selectedMappings.length} mapeamento(s) selecionado(s)?</p>
          
          <div className="max-h-10rem overflow-auto border-1 surface-border border-round p-2 mt-2">
            <ul>
              {selectedMappings.map(mapping => (
                <li key={mapping.id} className="text-sm mb-1">
                  <strong>{mapping.companyAccount}</strong> →{' '}
                  <strong>{mapping.defaultAccount.accountingAccount}</strong> - {mapping.defaultAccount.accountName}
                </li>
              ))}
            </ul>
          </div>
          
          <p className="text-sm text-500 mt-2">
            As contas parametrizadas serão movidas de volta para a lista de contas não parametrizadas.
          </p>
        </div>
      </Dialog>
    </>
  )
}