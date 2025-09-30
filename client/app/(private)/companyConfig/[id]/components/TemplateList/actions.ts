'use server';
import { serverApi } from '@/app/api/api';
import { cookies } from 'next/headers';

export async function getCompanyData(companyId: string) {
  try {
    // Obter os cookies da requisição
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    const res = await serverApi.get(`/config/template`, {
      headers: {
        'Cache-Control': 'max-age=3600',
        'Cookie': `token=${token}` // Passar o cookie manualmente
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Erro ao buscar dados da empresa:', error);
    return [];
  }
}

export async function getSourceData(companyId: string) {
  try {
    // Obter os cookies da requisição
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    const res = await serverApi.get(
      `/config/company/${companyId}`,
      {
        headers: {
          'Cache-Control': 'max-age=3600',
          'Cookie': `token=${token}` // Passar o cookie manualmente
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Erro ao buscar dados de origem:', error);
    return { data: [], total: 0 };
  }
}

export async function relateAccounts(companyId: string, companyAccount: string, defaultAccountId: number) {
  try {
    // Obter os cookies da requisição
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    const res = await serverApi.post(
      `/config/mapping`,
      {
        companyId,
        companyAccount,
        defaultAccountId
      },
      {
        headers: {
          'Cookie': `token=${token}` // Passar o cookie manualmente
        }
      }
    );
    
    return res.data;
  } catch (error) {
    console.error('Erro ao relacionar contas:', error);
    throw error;
  }
}


export async function createAccount(accountData: { companyId: string;  configs: {accountingAccount: string; accountName: string; }[]}) {
  try {
    // Obter os cookies da requisição
    console.log('Criando conta com dados:', accountData);
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value; 
    const res = await serverApi.post(
      `/config/company`,
      accountData,
      {
        headers: {
          'Cookie': `token=${token}` // Passar o cookie manualmente
        },
      }
    );
    return res.data;
  } catch (error: any) {
    
    if (error.response?.status === 409) {
      // A mensagem pode estar em diferentes propriedades
      const serverMessage = error.response.data?.message 
        || error.response.data?.error 
        || 'Esta conta já existe para esta empresa.';
      
      throw new Error(serverMessage);
    } 
    else if (error.response?.status === 404) {
      throw new Error(error.response.data?.message || 'Empresa não encontrada.');
    } 
    else if (error.response?.status === 400) {
      throw new Error(error.response.data?.details?.[0]?.message || 'Dados inválidos.');
    } 
    else {
      throw new Error(error.response?.data?.message || 'Falha ao criar conta.');
    }
  }
}


export const deleteAccount = async (companyId: string, accountingAccount: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    const res = await serverApi.delete(
      `/config/company/${companyId}`,
      {
        data: { accountingAccount },
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error('Erro ao excluir conta:', error);
    
    if (error.response?.status === 404) {
      throw new Error(error.response.data?.message || 'Conta não encontrada');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Dados inválidos');
    } else {
      throw new Error(error.response?.data?.message || 'Falha ao excluir conta');
    }
  }
};


export const deleteMultipleAccounts = async (companyId: string, accountingAccounts: string[]) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    const res = await serverApi.delete(
      `/config/company/${companyId}`,
      {
        data: { accountingAccounts }, // Agora é um array
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error('Erro ao excluir contas:', error);
    
    if (error.response?.status === 404) {
      throw new Error(error.response.data?.message || 'Contas não encontradas');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Dados inválidos');
    } else {
      throw new Error(error.response?.data?.message || 'Falha ao excluir contas');
    }
  }
};