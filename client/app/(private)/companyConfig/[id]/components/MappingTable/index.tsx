'use client';
import api from "@/app/api/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";

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

  const onSelectionChange = (value: Mapping | null) => {
    setSelected(value);
  };

  const fetchMappings = async () => {

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
  }

  useEffect(() => {
    fetchMappings();
  }, [companyId]);

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

  return(
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
      <Column body={companyAccount} header="Conta Parametrizada" style={{ minWidth: '200px' }} />
      <Column body={arrowIcon} header="" style={{ minWidth: '50px' }} />
      <Column body={defaultAccount} header="Conta Padrão" style={{ minWidth: '200px' }} />
    
    </DataTable>
  )
}