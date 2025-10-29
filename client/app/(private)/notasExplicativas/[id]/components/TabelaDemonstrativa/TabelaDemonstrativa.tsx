// src/components/TabelaDemonstrativa/TabelaDemonstrativa.tsx
import { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { TabelaDemonstrativa as TabelaType } from '../../types';
import api from '@/app/api/api';
import TabelaHeader from './TabelaHeader';
import TabelaBody from './TabelaBody';
import InfoBox from './InfoBox';
import { useTabelaDemonstrativa } from './useTabelaDemonstrativa';

interface TabelaDemonstrativaProps {
  notaId: string;
  tabelas: TabelaType[];
  onTabelasChange: (tabelas: TabelaType[]) => void;
  companyId: string;
}

export default function TabelaDemonstrativa({ 
  notaId, 
  tabelas, 
  onTabelasChange,
  companyId 
}: TabelaDemonstrativaProps) {
  const toast = useRef<Toast>(null);
  const {
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
  } = useTabelaDemonstrativa({
    notaId,
    tabelas,
    onTabelasChange,
    companyId,
    toast
  });

  useEffect(() => {
    fetchContasBalancete();
  }, [companyId]);

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

      <TabelaHeader 
        anoAnterior={anoAnterior}
        anoAtual={anoAtual}
        onAddRow={handleAddRow}
      />

      <TabelaBody
        tabelas={tabelas}
        contasBalancete={contasBalancete}
        loadingContas={loadingContas}
        anoAnterior={anoAnterior}
        anoAtual={anoAtual}
        onContaSelect={handleContaSelect}
        onUpdateRow={handleUpdateRow}
        onDeleteRow={handleDeleteRow}
      />

      {contasBalancete.length === 0 && !loadingContas && (
        <InfoBox
          type="warning"
          icon="pi pi-exclamation-triangle"
          message="Nenhuma conta encontrada no balancete. Faça o upload do balancete primeiro."
        />
      )}

      
    </div>
  );
}