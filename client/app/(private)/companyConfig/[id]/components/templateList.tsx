'use client'
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import api from '@/app/api/api';


export default function TemplateList() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);

    const fetchTemplate = async () => {
        try {
            const res = await api.get('/config/template');
            const data = await res.data;

            if (!res.status) {
                console.error('Erro ao buscar as empresas:', data.error);
                return;
            }

            setSource(data);
        } catch (err) {
            console.error('Erro inesperado:', err);
        }
    };

    useEffect(() => {
        
    }, []);

    const onChange = (event:any) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item:any) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`} alt={item.name} />
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.category}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item.price}</span>
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
              sourceHeader="Contas não configuradas" 
              targetHeader="Contas Padrão" 
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
        