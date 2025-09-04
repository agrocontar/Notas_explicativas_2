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

export async function relateAccounts(companyId: string, sourceAccountId: number, targetAccountId: number) {
  try {
    // Obter os cookies da requisição
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    const res = await serverApi.post(
      `/config/mapping/${companyId}`,
      {
        companyId,
        sourceAccountId,
        targetAccountId
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