'use client'
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { SelectCompany } from './components/selectCompany';

export interface Company {
    id: string;
    name: string;
}

const UploadPage = () => {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [date, setDate] = useState<any>(null);

    const handleUpload = (event: any) => {
        const file: File = event.files[0];

        if (file && date && selectedCompany) {
            const formData: any = new FormData();
            formData.append('file', file);
            formData.append('ano', date.getFullYear());
            formData.append('mes', date.getMonth() + 1);
            formData.append('empresaId', selectedCompany.id);
            

        }
    };

    return (
        <div className="grid">
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
                                    />
                                </div>
                            </div>

                            <FileUpload
                                name="balanceteAtual"
                                customUpload
                                uploadHandler={handleUpload}
                                multiple={false}
                                accept=".xlsx"
                                maxFileSize={1000000}
                                disabled={!selectedCompany}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UploadPage;
