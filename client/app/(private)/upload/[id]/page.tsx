'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { readExcelFile } from './services/readExcel';
import api from '@/app/api/api';
import { Balancete, ExcelData } from './types';
import { validateAccountingAccounts } from './services/validateAccountingAccounts';
import { processMappedAccounts } from './services/processMappedAccounts';
import { fetchBalanceAccounts, fetchDefaultAccounts } from './services/apis';
import BalanceTable from './components/BalanceTable';

interface CompanyUploadPageProps {
  params: {
    id: string
  }
}

const uploadBalanceteData = async (data: ExcelData): Promise<{ success: boolean; inserted: number }> => {
    try {
        const response = await api.post('/balancete', data);
        const dataResponse = response.data

        if (response.status !== 200) {
            throw new Error(`Erro no servidor: ${response.status}`);
        }

        return dataResponse;
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        throw error;
    }
};

const UploadPage = ({ params }: CompanyUploadPageProps) => {
    const [date, setDate] = useState<Date | null>(null);
    const [uploading, setUploading] = useState(false);
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<any>(null);
    const [currentBalanceAccounts, setCurrentBalanceAccounts] = useState<Balancete[]>([]);
    const [previousBalanceAccounts, setPreviousBalanceAccounts] = useState<Balancete[]>([]);
    const currentYear = new Date().getFullYear();
    
    // Usar useCallback para evitar recriação desnecessária
    const showToast = useCallback((severity: 'success' | 'error', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    }, []);

    // Mover handleUpload para useCallback
    const handleUpload = useCallback(async (event: any) => {
        const file: File = event.files[0];
        
        setUploading(true);

        try {
            // Validar se a data foi selecionada
            if (!date) {
                showToast('error', 'Erro', 'Selecione o ano de referência primeiro');
                setUploading(false);
                return;
            }

            // Ler o arquivo Excel
            const excelData = await readExcelFile(file, params.id, date);

            // Verificar se há dados válidos
            if (!excelData.balanceteData || excelData.balanceteData.length === 0) {
                throw new Error('Nenhum dado válido encontrado no arquivo');
            }

            const validationResult = await validateAccountingAccounts(
                excelData.balanceteData,
                params.id
            );

            if (!validationResult.isValid) {
                const invalidList = validationResult.invalidAccounts.join(', ');
                showToast('error', 'Erro', `Foram encontradas contas não mapeadas, verifique o plano de contas!`);
                console.log(`Contas contábeis inválidas encontradas: ${invalidList}`);
                return;
            }

            const defaultAccounts = await fetchDefaultAccounts();

            // Processar mapeamentos e somar valores
            const processedData = processMappedAccounts(
                validationResult.validData,
                validationResult.mappings || [],
                defaultAccounts
            );

            // Preparar dados para envio
            const payload = {
                companyId: params.id,
                referenceDate: date.getFullYear(),
                balanceteData: processedData.map(item => ({
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

            // Limpar o arquivo selecionado após o sucesso
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }

            showToast('success', 'Sucesso', `Dados enviados com sucesso! ${result.inserted} registros inseridos.`);

            // Recarregar os dados do balancete após upload bem-sucedido
            getBalanceteData();

        } catch (error: any) {
            console.error('Erro no upload:', error);
            showToast('error', 'Erro', error.message || 'Falha ao processar o arquivo. Verifique o formato.');
            // Limpar o arquivo selecionado após o erro
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        } finally {
            setUploading(false);
        }
    }, [date, params.id, showToast]);

    // Mover getBalanceteData para useCallback
    const getBalanceteData = useCallback(async () => {
        try {
            const currentBalance = await fetchBalanceAccounts({ year: currentYear, companyId: params.id });
            setCurrentBalanceAccounts(currentBalance);
            const previousBalance = await fetchBalanceAccounts({ year: currentYear - 1, companyId: params.id });
            setPreviousBalanceAccounts(previousBalance);
        } catch (error) {
            console.error('Erro ao buscar dados do balancete:', error);
            showToast('error', 'Erro', 'Falha ao carregar dados do balancete');
        }
    }, [currentYear, params.id, showToast]);

    // Corrigir o useEffect - remover handleUpload das dependências
    useEffect(() => {
        getBalanceteData();
    }, [getBalanceteData]); // Apenas getBalanceteData como dependência

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <Card title="Upload de Balancetes" className="p-shadow-5">
                    <div className="grid">
                        <div className="col-12">
                            <div className="flex flex-row gap-3 mb-3">
                                <div className="flex align-items-center gap-2">
                                    <span>Ano Referencia:</span>
                                    <Calendar
                                        value={date}
                                        onChange={(e) => setDate(e.value as Date)}
                                        view="year"
                                        dateFormat="yy"
                                        showIcon
                                        yearNavigator
                                        yearRange="2023:2026"
                                    />
                                </div>
                                <div className='flex align-items-center gap-2'>
                                    <span>Arquivo:</span>
                                    <FileUpload
                                        ref={fileUploadRef}
                                        name="balanceteAtual"
                                        customUpload
                                        uploadHandler={handleUpload}
                                        multiple={false}
                                        accept=".xlsx,.xls"
                                        maxFileSize={10000000}
                                        mode="basic"
                                        chooseLabel={uploading ? 'Processando...' : 'Selecionar Arquivo'}
                                        auto
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                
                <div className="card mt-3">
                    <BalanceTable 
                        balanceAccounts={currentBalanceAccounts} 
                        year={currentYear} 
                        title={`Balancete Atual - ${currentYear}`} 
                    />
                </div>
                
                <div className="card mt-3">
                    <BalanceTable 
                        balanceAccounts={previousBalanceAccounts} 
                        year={currentYear - 1} 
                        title={`Balancete Anterior - ${currentYear - 1}`} 
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadPage;