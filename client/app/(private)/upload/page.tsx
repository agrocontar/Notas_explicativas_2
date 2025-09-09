'use client'
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { SelectCompany } from './components/selectCompany';
import { Toast } from 'primereact/toast';
import { readExcelFile } from './services/readExcel';
import api from '@/app/api/api';
import { ExcelData } from './types';
import { validateAccountingAccounts } from './services/validateAccountingAccounts';

export interface Company {
    id: string;
    name: string;
}

const uploadBalanceteData = async (data: ExcelData): Promise<{ success: boolean; inserted: number }> => {
  try {
    const response = await api.post('/balancete', data);
    const dataResponse= response.data

    if (response.status != 200) {
      throw new Error(`Erro no servidor: ${response.status}`);
    }

    return dataResponse;
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    throw error;
  }
};

const UploadPage = () => {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [date, setDate] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const toast = React.useRef<Toast>(null);

    const handleUpload = async (event: any) => {
        const file: File = event.files[0];

        if (!file || !date || !selectedCompany) {
            showToast('error', 'Erro', 'Selecione empresa, data e arquivo antes de enviar');
            return;
        }

        setUploading(true);

        try {
                  // Ler o arquivo Excel
            const excelData = await readExcelFile(file, 'company-id', new Date());
            
            console.log('Dados processados para envio:', excelData.balanceteData.slice(0, 10)); // Mostrar as primeiras 10 linhas
            
            // Verificar se há dados válidos
            if (!excelData.balanceteData || excelData.balanceteData.length === 0) {
              throw new Error('Nenhum dado válido encontrado no arquivo');
            }

            const validationResult = await validateAccountingAccounts(
                excelData.balanceteData,
                selectedCompany.id
            );

            if (!validationResult.isValid) {
                const invalidList = validationResult.invalidAccounts.join(', ');
                showToast('error', 'Erro', `Contas contábeis inválidas encontradas: ${invalidList}`);
                console.log(`Contas contábeis inválidas encontradas: ${invalidList}`);
                return;
            }

            // Preparar dados para envio
            const payload = {
              companyId: selectedCompany.id,
              referenceDate: date.getFullYear(),
              balanceteData: excelData.balanceteData.map(item => ({
                accountingAccount: item.accountingAccount || '',
                accountName: item.accountName || '',
                previousBalance: item.previousBalance ?? 0,
                debit: item.debit ?? 0,
                credit: item.credit ?? 0,
                monthBalance: item.monthBalance ?? 0,
                currentBalance: item.currentBalance ?? 0
              }))
            };

            console.log('Payload enviado:', payload);

            
            // Enviar para o backend
            const result = await uploadBalanceteData(payload);
            
            showToast('success', 'Sucesso', `Dados enviados com sucesso! ${result.inserted} registros inseridos.`);
            
        } catch (error) {
            console.error('Erro no upload:', error);
            showToast('error', 'Erro', 'Falha ao processar o arquivo. Verifique o formato.');
        } finally {
            setUploading(false);
        }
    };

    const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <Card title="Upload de Balancetes" className="p-shadow-5">
                    <div className="grid">
                        <div className="col-12">
                            <div className="flex flex-row gap-3 mb-3">
                                <div className="flex align-items-center gap-2">
                                    <span>Empresa</span>
                                    <SelectCompany
                                        setSelectedCompany={setSelectedCompany}
                                        selectedCompany={selectedCompany}
                                    />
                                </div>

                                <div className="flex align-items-center gap-2">
                                    <span>Ano Referencia:</span>
                                    <Calendar
                                        value={date}
                                        onChange={(e) => setDate(e.value)}
                                        view="year"
                                        dateFormat="yy"
                                        showIcon
                                        yearNavigator
                                        yearRange="2023:2026"
                                    />
                                </div>
                            </div>

                            <FileUpload
                                name="balanceteAtual"
                                customUpload
                                uploadHandler={handleUpload}
                                multiple={false}
                                accept=".xlsx,.xls"
                                maxFileSize={10000000}
                                disabled={!selectedCompany || !date || uploading}
                                mode="basic"
                                chooseLabel={uploading ? 'Processando...' : 'Selecionar Arquivo'}
                                auto
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UploadPage;