
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import { GroupCompanies } from '../page';

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

interface PermissionListProps {
  companies: Company[];
}

export default function PermissionList({ companies }: PermissionListProps){
    const [source, setSource] = useState<Company[]>([]);
    const [target, setTarget] = useState<Company[]>([]);

    useEffect(() => {
        setSource(companies);
        setTarget([]);
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
                sourceHeader="Usuários Disponíveis" targetHeader="Usuários do Grupo" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }}
                sourceFilterPlaceholder="Buscar por nome" targetFilterPlaceholder="Buscar por nome" />
        </div>
    );
}
        