'use client';
import api from "@/app/api/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";

interface MappingTableProps {
  companyId: string;
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

export default function MappingTable({ companyId }: MappingTableProps) {
  const [mappingData, setMappingData] = useState<Mapping[]>([]);
  const [selected, setSelected] = useState<Mapping | null>(null);
  const [emptyMessage, setEmptyMessage] = useState('Nenhum mapeamento encontrado.');
  const [deleteDialog, setDeleteDialog] = useState(false);

  const onSelectionChange = (value: Mapping | null) => {
    setSelected(value);
  };

  // fetchMappings com useCallback
  const fetchMappings = useCallback(async () => {
    try {
      const res = await api.get(`/config/mapping/${companyId}`);
      const data = await res.data;

      if (!res.status) {
        console.error('Erro ao buscar os Mapeamentos:', data.error);
        return;
      }

      setMappingData(data);
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  }, [companyId]);

  useEffect(() => {
    fetchMappings();
  }, [companyId, fetchMappings]);

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


  const confirmDeleteMapping = (mapping: Mapping) => {
    setSelected(mapping);
    setDeleteDialog(true);
  };

  const actionBodyTemplate = (rowData: Mapping) => {
      return (
        <>
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            onClick={() => confirmDeleteMapping(rowData)}
          />
        </>
      );
    }

    const deleteMapping = async () => {
      if (!selected) return;
      try {
        await api.delete(`/config/mapping/${selected.id}`);
        setMappingData(prev => prev.filter(item => item.id !== selected.id));
        setDeleteDialog(false);
        setSelected(null);
        window.location.reload();
      }
      catch (err) {
        console.error('Erro ao excluir mapeamento:', err);
      }
    };

    const deleteDialogFooter = (
      <>
        <Button label="Cancelar" icon="pi pi-times" text onClick={() => setDeleteDialog(false)} />
        <Button label="Excluir" icon="pi pi-check" text onClick={deleteMapping} />
      </>
    );

  return(
    <>
    <DataTable
      value={mappingData}
      selectionMode="single"
      selection={selected}
      onSelectionChange={(e) => onSelectionChange(e.value as Mapping)}
      dataKey="id"
      scrollable
      scrollHeight="400px"
      className="p-datatable-sm"
      emptyMessage={emptyMessage}
    >
      <Column body={companyAccount} header="Conta Parametrizada" style={{ minWidth: '100px' }} />
      <Column body={arrowIcon} header="" style={{ minWidth: '50px' }} />
      <Column body={defaultAccount} header="Conta Padrão" style={{ minWidth: '200px' }} />
      <Column body={actionBodyTemplate} header="Ações" style={{ minWidth: '150px' }} />
    
    </DataTable>

    <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Excluir Mapeamento" modal className="p-fluid" footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
      <div className="field">
        <label htmlFor="deleteMapping">Tem certeza que deseja excluir este mapeamento?</label>
      </div>
    </Dialog>
    </>
  )
}