'use client';
import InputPlan from "./components/inputPlan/InputPlan";
import MappingTable from "./components/MappingTable";
import TemplateList from "./components/TemplateList";
import { getCompanyData } from "./components/TemplateList/actions";
import { useState, useEffect } from "react";
import { Account } from "./components/TemplateList/types";

interface CompanyConfigPageProps {
  params: {
    id: string
  }
}

export default function CompanyConfigPage({ params }: CompanyConfigPageProps) {
  const [initialData, setInitialData] = useState<Account[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await getCompanyData(params.id);
        console.log('Dados carregados no CompanyConfigPage:', data);
        setInitialData(data || []);
      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
        setInitialData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [params.id, refreshTrigger]);

  // Função para lidar com mapeamentos deletados
  const handleMappingsDeleted = (deletedAccounts: string[]) => {
    console.log('Contas desmapeadas:', deletedAccounts);
    setRefreshTrigger(prev => prev + 1);
  };

  // NOVO: Função para lidar com mapeamentos criados
  const handleMappingsCreated = () => {
    console.log('Novos mapeamentos criados - atualizando dados...');
    setRefreshTrigger(prev => prev + 1);
  };

  // Se ainda está carregando, mostra loading
  if (isLoading) {
    return (
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <span>Carregando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="mb-4 p-2 border-bottom-1 surface-border flex align-items-center justify-content-between">
            <h2>Configuração do Plano de Contas</h2>
            <InputPlan companyId={params.id} />
          </div>
          <TemplateList 
            companyId={params.id} 
            initialData={initialData} 
            key={refreshTrigger}
            onMappingCreated={handleMappingsCreated} // NOVO: Callback para mapeamentos criados
          />
        </div>
        <div className="card">
          <div className="mb-4 p-2 border-bottom-1 surface-border">
            <h2>Mapeamentos</h2>
          </div>
          <MappingTable 
            companyId={params.id} 
            onMappingsDeleted={handleMappingsDeleted}
            key={refreshTrigger} // NOVO: Adiciona key para forçar recriação
          />
        </div>
      </div>
    </div>
  )
}