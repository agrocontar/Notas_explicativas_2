import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// Configuração específica para o servidor (Server Actions)
export const serverApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar cookies manualmente nas requisições do servidor
serverApi.interceptors.request.use(async (config) => {
  // Em ambiente de servidor, precisamos passar os cookies manualmente
  // Isso será preenchido pelas Server Actions
  return config;
});