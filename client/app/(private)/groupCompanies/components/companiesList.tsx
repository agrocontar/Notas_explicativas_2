import React, { useState, useEffect, useMemo } from 'react';
import { PickList } from 'primereact/picklist';
import api from '@/app/api/api';

interface Company {
    id: string;
    name: string;
    cnpj: string;
}

interface CompaniesListProps {
    companies: Company[];
}

export default function CompaniesList({ companies }: CompaniesListProps) {
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [target, setTarget] = useState<Company[]>([]);

    // Filtrar source para mostrar apenas empresas não vinculadas ao grupo
    const source = useMemo(() => {
        return allCompanies.filter(company => 
            !target.some(targetCompany => targetCompany.id === company.id)
        );
    }, [allCompanies, target]);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/companies');
            const data = await res.data;

            if (!res.status) {
                console.error('Erro ao buscar as empresas:', data.error);
                return;
            }

            setAllCompanies(data);
        } catch (err) {
            console.error('Erro inesperado:', err);
        }
    };

    useEffect(() => {
        fetchCompanies();
        setTarget(companies);
    }, [companies]);

    const onChange = (event: any) => {
        setAllCompanies(event.source.concat(event.target));
        setTarget(event.target);
    };

    const itemTemplate = (item: any) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <span className="font-bold">{item.name}</span>
                <span className="text-sm text-gray-500">({item.cnpj})</span>
            </div>
        );
    };

    return (
        <div className="card">
            <PickList 
                dataKey="id" 
                source={source} 
                target={target} 
                onChange={onChange} 
                itemTemplate={itemTemplate} 
                filter 
                filterBy="name" 
                breakpoint="1280px"
                sourceHeader="Empresas Disponíveis" 
                targetHeader="Empresas do Grupo" 
                sourceStyle={{ height: '18rem' }} 
                targetStyle={{ height: '18rem' }}
                sourceFilterPlaceholder="Buscar por nome" 
                targetFilterPlaceholder="Buscar por nome" 
                showSourceControls={false} 
                showTargetControls={false} 
            />
        </div>
    );
}