'use client';

import api from "@/app/api/api";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Balanco } from "../types";
import BalancoTable from "./components/balancoTable";

interface BalancoPageParams {
  params: {
    id: string
  }
}

const BalancoPage = async ({ params }: BalancoPageParams) => {
  const toast = useRef<Toast>(null);
  const [balances, setBalances] = useState<Balanco[]>([]);
  const year = new Date().getFullYear();
  
  const fetchBalances = async () => {
    try {
      const res = await api.get('/balanco', {
        params: { companyId: params.id, year: year}
      });
      const data = await res.data;

      if (!res.status) {
        console.error('Erro ao buscar os balanços:', data.error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar os balanços.',
          life: 3000,
        });
        return;
      }

      setBalances(data);
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  useEffect(()=> {
    fetchBalances();
  }, [])

  return (

    <div className="grid crud-demo">
          <div className="col-12">
            <div className="card">
    
              <Toast ref={toast} />

              <BalancoTable balances={balances} year={year} group={'ATIVO_CIRCULANTE'} />
            </div>
          </div>
        </div>
      );
}

export default BalancoPage;