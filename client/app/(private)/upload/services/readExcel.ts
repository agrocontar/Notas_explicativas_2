import ExcelJS from 'exceljs';

export interface BalanceteRow {
  accountingAccount: string;
  accountName: string;
  previousBalance: number;
  debit: number;
  credit: number;
  monthBalance: number;
  currentBalance: number;
}

export interface ExcelData {
  companyId: string;
  referenceDate: string;
  balanceteData: BalanceteRow[];
}

export const readExcelFile = async (file: File, companyId: string, date: Date): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        
        // Carregar o workbook do ArrayBuffer
        await workbook.xlsx.load(arrayBuffer);
        
        // Assumindo que os dados estão na primeira planilha
        const worksheet = workbook.worksheets[0];
        
        const balanceteData: BalanceteRow[] = [];
        
        // Iterar pelas linhas (pulando o cabeçalho se houver)
        worksheet.eachRow((row, rowNumber) => {
          // Pular a primeira linha se for cabeçalho
          if (rowNumber === 1) return;
          
          // Mapear as colunas conforme a estrutura esperada
          // Ajuste os índices das colunas conforme seu arquivo Excel
          const rowData: BalanceteRow = {
            accountingAccount: row.getCell(1).text?.toString() || '',
            accountName: row.getCell(2).text?.toString() || '',
            previousBalance: parseFloat(row.getCell(3).text?.toString() || '0'),
            debit: parseFloat(row.getCell(4).text?.toString() || '0'),
            credit: parseFloat(row.getCell(5).text?.toString() || '0'),
            monthBalance: parseFloat(row.getCell(6).text?.toString() || '0'),
            currentBalance: parseFloat(row.getCell(7).text?.toString() || '0'),
          };
          
          balanceteData.push(rowData);
        });
        
        const excelData: ExcelData = {
          companyId,
          referenceDate: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
          balanceteData
        };
        
        resolve(excelData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};