import api from "@/app/api/api";
import { CompanyAccount, DefaultAccount, MappedAccount } from "../types";

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

export const fetchCompanyMappedAccounts = async (companyId: string) => {

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