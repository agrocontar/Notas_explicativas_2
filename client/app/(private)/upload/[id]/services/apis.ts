import api from "@/app/api/api";
import { Balancete, CompanyAccount, DefaultAccount, MappedAccount } from "../types";

interface CreateCompanyConfigParams {
  companyId: string;
  configs: CompanyAccount[];
}

export const createCompanyConfigs = async ({companyId, configs}: CreateCompanyConfigParams) => {
  try {
    const response = await api.post(`/config/company/`, { companyId, configs });

    if (!response.status || response.status !== 200) {
      throw new Error(response.data?.message || response.data?.error || 'Erro ao criar configurações da empresa');
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao criar configurações da empresa:', error);
    return [];
  }
};

export const fetchCompanyAccounts = async (companyId: string): Promise<CompanyAccount[]> => {
  try {
    const response = await api.get(`/config/company/${companyId}`); 

    if (!response.status || response.status !== 200) {
      throw new Error(response.data?.error || 'Erro ao buscar contas da empresa');
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contas da empresa:', error);
    return [];
  }
};

export const fetchCompanyMappings = async (companyId: string) => {

  try {
    const response = await api.get(`/config/mapping/${companyId}`);

    if (!response.status || response.status !== 200) {
      throw new Error(response.data?.error || 'Erro ao buscar contas mapeadas da empresa');
    }

    return response.data as MappedAccount[];
  } catch (error) {
    console.error('Erro ao buscar contas mapeadas da empresa:', error);
    return [];
  }
}

export const fetchDefaultAccounts = async (): Promise<DefaultAccount[]> => {
  try {
    const response = await api.get('/config/template');

    if (!response.status || response.status !== 200) {
      throw new Error(response.data?.error || 'Erro ao buscar contas padrão');
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contas padrão:', error);
    return [];
  }
};

export const fetchBalanceAccounts = async ({year, companyId}: {year: number, companyId: string}) => {
  try {
    const response = await api.patch('/balancete', {year, companyId});

    if (!response.status || response.status !== 200) {
      throw new Error(response.data?.error || 'Erro ao buscar contas padrão');
    }

    return response.data as Balancete[];
  } catch (error) {
    console.error('Erro ao buscar contas padrão:', error);
    return [];
  }
};

export const fetchCompanyPlan = async (companyId: string) => {
  try {
    const response = await api.get(`/companies/plan/${companyId}`);

    if (!response.status || response.status !== 200) {
      throw new Error(response.data?.error || 'Erro ao buscar plano da empresa');
    }

    return response.data as {planOfCountsAgrocontar: boolean};
  } catch (error) {
    console.error('Erro ao buscar plano da empresa:', error);
    return 
  }
};