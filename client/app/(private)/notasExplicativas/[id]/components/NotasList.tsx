// src/components/NotasList/NotasList.tsx
import { OrderList } from "primereact/orderlist";
import { NotaExplicativa } from "../types";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import api from '@/app/api/api';

interface NotasListProps {
  notas: NotaExplicativa[];
  selectedNota: NotaExplicativa | null;
  onNotaSelect: (nota: NotaExplicativa) => void;
  onReorder: (notas: NotaExplicativa[]) => void;
  companyId: string;
}

export default function NotasList({ 
  notas, 
  selectedNota, 
  onNotaSelect, 
  onReorder,
  companyId
}: NotasListProps) {
  const toast = useRef<Toast>(null);

  const handleReorder = async (event: any) => {
    const reorderedNotas = event.value as NotaExplicativa[];
    
    try {
      // Atualiza o estado local primeiro para uma resposta mais rápida
      onReorder(reorderedNotas);

      // Prepara os dados para enviar ao backend
      const novasOrdens = reorderedNotas.map((nota, index) => ({
        id: nota.id,
        number: index + 1 // Números começam em 1
      }));

      // Envia para o backend
      const response = await api.patch(`/notas/${companyId}/reorder`, {
        novasOrdens
      });

      if (response.status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ordem das notas salva com sucesso',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Erro ao reordenar notas:', error);
      
      // Reverte a ordem em caso de erro
      onReorder(notas);
      
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao salvar a ordem das notas',
        life: 5000,
      });
    }
  };

  const itemTemplate = (nota: NotaExplicativa) => {
    return (
      <div 
        className={`flex flex-column p-2 border-round cursor-pointer transition-colors transition-duration-200 ${
          selectedNota?.id === nota.id ? 'bg-blue-50 border-1 border-blue-200' : 'hover:bg-gray-50'
        }`}
        onClick={() => onNotaSelect(nota)}
      >
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center gap-2 flex-1 min-w-0">
            <span className="flex-shrink-0 w-2rem h-2rem bg-primary border-circle text-white font-bold flex align-items-center justify-content-center text-sm">
              {nota.number}
            </span>
            <div className="flex flex-column flex-1 min-w-0">
              <span className="font-semibold text-sm truncate">{nota.title}</span>
              <span className="text-xs text-color-secondary truncate">
                Atualizada em: {new Date(nota.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          <i className="pi pi-chevron-right text-color-secondary flex-shrink-0 ml-1 text-xs"></i>
        </div>
        
        {/* Indicador de tabelas demonstrativas */}
        {nota.tabelas && nota.tabelas.length > 0 && (
          <div className="flex align-items-center gap-1 mt-1">
            <i className="pi pi-table text-xs text-color-secondary"></i>
            <span className="text-xs text-color-secondary">
              {nota.tabelas.length} {nota.tabelas.length === 1 ? 'linha' : 'linhas'} na tabela
            </span>
          </div>
        )}
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-between align-items-center p-2">
        <span className="text-base font-bold truncate">Notas</span>
        <span className="text-color-secondary flex-shrink-0 ml-1 text-sm">{notas.length} notas</span>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-column align-items-center justify-content-center p-4 text-color-secondary">
        <i className="pi pi-inbox text-2xl mb-2"></i>
        <span className="text-sm">Nenhuma nota encontrada</span>
      </div>
    );
  };

  return (
    <div className="col-12 lg:col-6 xl:col-5">
      <Toast ref={toast} />
      <div className="card h-full">
        <OrderList
          value={notas}
          itemTemplate={itemTemplate}
          header={headerTemplate()}
          dragdrop
          dataKey="id"
          onChange={handleReorder}
          listStyle={{ 
            maxHeight: '65vh',
            minHeight: '350px'
          }}
          className="w-full"
        />
        
        {/* Instruções de uso */}
        <div className="p-2 border-top-1 surface-border">
          <div className="flex align-items-center gap-2 text-xs text-color-secondary">
            <i className="pi pi-info-circle"></i>
            <span>Arraste e solte para reordenar as notas</span>
          </div>
        </div>
      </div>
    </div>
  );
}