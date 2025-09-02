
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

interface CompaniesListProps {
  companies: Company[];
}

export default function CompaniesList({ companies }: CompaniesListProps){
    const [source, setSource] = useState<Company[]>([]);
    const [target, setTarget] = useState<Company[]>([]);

    useEffect(() => {
        setSource([]);
        setTarget(companies);
    }, [companies]); 

    const onChange = (event: any) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item: any) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <span className="font-bold">{item.name}</span>
            </div>
        );
    };

    return (
        <div className="card">
            <PickList dataKey="id" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} filter filterBy="name" breakpoint="1280px"
                sourceHeader="Empresas Disponíveis" targetHeader="Empresas do Grupo" sourceStyle={{ height: '18rem' }} targetStyle={{ height: '18rem' }}
                sourceFilterPlaceholder="Buscar por nome" targetFilterPlaceholder="Buscar por nome" showSourceControls={false} showTargetControls={false} />
        </div>
    );
}
        