import * as XLSX from 'xlsx';
import { BalanceteRow, ExcelData } from '../types';
import { normalizeAccountingAccount } from './normalizeAccounting';

export const readExcelFile = async (file: File, companyId: string, date: Date): Promise<ExcelData> => {
  try {

    // Verificar se o arquivo é realmente um Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && 
        !file.type.includes('spreadsheet') && !file.type.includes('excel')) {
      throw new Error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
    }

    // Verificar se o arquivo não está vazio
    if (file.size === 0) {
      throw new Error('Arquivo vazio ou corrompido');
    }

    // Verificar tamanho máximo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
    }

    // Ler o arquivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Verificar se o ArrayBuffer tem dados
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Arquivo corrompido - sem dados');
    }

    // Tentar ler o workbook
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(arrayBuffer, { 
        type: 'array',
        cellText: false,
        cellDates: true,
        raw: false
      });
    } catch (readError) {
      console.error('Erro na leitura do XLSX:', readError);
      throw new Error('Formato de arquivo inválido. Certifique-se de que é um arquivo Excel válido.');
    }

    // Verificar se o workbook tem planilhas
    if (workbook.SheetNames.length === 0) {
      throw new Error('O arquivo Excel não contém planilhas');
    }

    // Pegar a primeira planilha
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    
    // Verificar se a planilha tem dados
    if (!worksheet['!ref']) {
      throw new Error('A planilha está vazia');
    }

    // Converter para JSON - manter como array 2D para melhor controle
    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1, 
      defval: '',
      blankrows: false 
    });


    // Verificar se há dados suficientes
    if (rawData.length <= 1) {
      throw new Error('A planilha não contém dados suficientes (apenas cabeçalho ou vazia)');
    }

    // Detectar automaticamente a linha do cabeçalho
    const headerRowIndex = detectHeaderRow(rawData as any[][]);

    // Mapear as colunas baseado no cabeçalho
    const headerRow = rawData[headerRowIndex] as string[];
    const columnMapping = mapColumnsFromHeader(headerRow);

    // Processar dados (começar da linha após o cabeçalho)
    const balanceteData: BalanceteRow[] = [];
    const errors: string[] = [];

    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      try {
        const row = rawData[i] as any[];
        
        // Pular linhas vazias
        if (!row || row.length === 0 || row.every(cell => cell === '' || cell === null || cell === undefined)) {
          console.log(`Linha ${i + 1} vazia, pulando...`);
          continue;
        }

        const rowData: BalanceteRow = {
          accountingAccount: normalizeAccountingAccount(String(row[columnMapping.contaContabil] || '').trim()),
          accountName: String(row[columnMapping.nomenclatura] || '').trim(),
          previousBalance: parseFinancialNumber(row[columnMapping.saldoAnterior]),
          debit: parseFinancialNumber(row[columnMapping.debito]),
          credit: parseFinancialNumber(row[columnMapping.credito]),
          monthBalance: parseFinancialNumber(row[columnMapping.saldoMes]),
          currentBalance: parseFinancialNumber(row[columnMapping.saldoAtual])
        };

        // Validar dados básicos - pelo menos a conta contábil deve existir
        if (!rowData.accountingAccount.trim()) {
          console.log(`Linha ${i + 1} sem conta contábil, pulando...`);
          continue;
        }

        balanceteData.push(rowData);
        
      } catch (rowError) {
        const errorMsg = rowError instanceof Error ? rowError.message : String(rowError);
        errors.push(`Erro na linha ${i + 1}: ${errorMsg}`);
        console.warn(`Erro processando linha ${i + 1}:`, rowError);
      }
    }

    // Log de erros se houver
    if (errors.length > 0) {
      console.warn('Erros durante o processamento:', errors);
    }

    // Verificar se algum dado foi processado
    if (balanceteData.length === 0) {
      throw new Error('Nenhum dado válido encontrado na planilha. Verifique o formato do arquivo.');
    }

    return {
      companyId,
      referenceDate: date.getFullYear(),
      balanceteData
    };

  } catch (error) {
    console.error('Erro detalhado ao ler arquivo Excel:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao processar o arquivo Excel';
    
    throw new Error(`Erro ao ler o arquivo Excel: ${errorMessage}`);
  }
};

// Função para mapear colunas baseado no cabeçalho
function mapColumnsFromHeader(headerRow: string[]): {
  contaContabil: number;
  nomenclatura: number;
  saldoAnterior: number;
  debito: number;
  credito: number;
  saldoMes: number;
  saldoAtual: number;
} {
  const mapping = {
    contaContabil: -1,
    nomenclatura: -1,
    saldoAnterior: -1,
    debito: -1,
    credito: -1,
    saldoMes: -1,
    saldoAtual: -1
  };

  headerRow.forEach((cell, index) => {
    const cellLower = String(cell).toLowerCase().trim();
    
    if (cellLower.includes('conta') && cellLower.includes('contábil')) {
      mapping.contaContabil = index;
    } else if (cellLower.includes('nomenclatura') && cellLower.includes('conta')) {
      mapping.nomenclatura = index;
    } else if (cellLower.includes('saldo') && cellLower.includes('anterior')) {
      mapping.saldoAnterior = index;
    } else if (cellLower.includes('débito') || cellLower.includes('debito')) {
      mapping.debito = index;
    } else if (cellLower.includes('crédito') || cellLower.includes('credito')) {
      mapping.credito = index;
    } else if (cellLower.includes('saldo') && cellLower.includes('mês')) {
      mapping.saldoMes = index;
    } else if (cellLower.includes('saldo') && cellLower.includes('atual')) {
      mapping.saldoAtual = index;
    }
  });

  // Fallback: se não detectar pelo nome, usar posições padrão (0, 1, 2, 3, 4, 5, 6)
  if (mapping.contaContabil === -1) mapping.contaContabil = 0;
  if (mapping.nomenclatura === -1) mapping.nomenclatura = 1;
  if (mapping.saldoAnterior === -1) mapping.saldoAnterior = 2;
  if (mapping.debito === -1) mapping.debito = 3;
  if (mapping.credito === -1) mapping.credito = 4;
  if (mapping.saldoMes === -1) mapping.saldoMes = 5;
  if (mapping.saldoAtual === -1) mapping.saldoAtual = 6;

  return mapping;
}

// Função para detectar automaticamente a linha do cabeçalho
function detectHeaderRow(data: any[][]): number {
  if (data.length === 0) return 0;
  
  // Palavras-chave do cabeçalho em português
  const headerKeywords = [
    'conta', 'contábil', 'nomenclatura', 'saldo', 'anterior', 
    'débito', 'debito', 'crédito', 'credito', 'mês', 'atual'
  ];
  
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i];
    if (!row) continue;
    
    let headerScore = 0;
    let hasConta = false;
    let hasSaldo = false;
    
    for (const cell of row) {
      const cellStr = String(cell).toLowerCase();
      
      if (cellStr.includes('conta') && cellStr.includes('contábil')) hasConta = true;
      if (cellStr.includes('saldo')) hasSaldo = true;
      
      if (headerKeywords.some(keyword => cellStr.includes(keyword))) {
        headerScore++;
      }
    }
    
    // Se encontrou "conta contábil" e "saldo" e tem boa pontuação, é o cabeçalho
    if (hasConta && hasSaldo && headerScore >= 3) {
      return i;
    }
  }
  
  return 0; // Assumir que a primeira linha é cabeçalho
}

// Função auxiliar para parse de números financeiros (formato brasileiro)
function parseFinancialNumber(value: any): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  // Se já for número
  if (typeof value === 'number') {
    return value;
  }

  const strValue = String(value).trim();
  
  // Remover pontos de milhar e converter vírgula decimal para ponto
  let cleanValue = strValue
    .replace(/\./g, '') // Remove pontos (1.000,00 → 1000,00)
    .replace(',', '.')  // Converte vírgula para ponto (1000,00 → 1000.00)
    .replace(/[^\d.-]/g, ''); // Remove caracteres não numéricos exceto ponto e sinal negativo

  // Se terminar com ponto, remover (caso de valores como "100,")
  if (cleanValue.endsWith('.')) {
    cleanValue = cleanValue.slice(0, -1);
  }

  // Tentar parsear como float
  const numberValue = parseFloat(cleanValue);
  
  // Se não for um número válido, retornar 0
  return isNaN(numberValue) ? 0 : numberValue;
}