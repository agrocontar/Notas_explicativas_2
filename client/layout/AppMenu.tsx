/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useRef, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import api from '@/app/api/api';
import { Toast } from 'primereact/toast';
import { useAuth } from '@/contexts/authContext'; 

interface Companies {
    id: string
    name: string
    createdAt: string
}

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { isCoordenador, isAdmin } = useAuth(); // Obter informação se é admin
    const [companies, setCompanies] = useState<Companies[]>([])



    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/companies/user');
                setCompanies(response.data);
            } catch (err) {
                console.error('Erro ao buscar empresas:', err);
            }
        };
        fetchCompanies();
    }, []);

    const companiesMenu = companies.map(company => ({
        label: company.name,
        icon: 'pi pi-fw pi-building',
        items: [
            { label: 'Notas Explicativas', icon: 'pi pi-fw pi-bookmark', },
            { label: 'Balanço', icon: 'pi pi-fw pi-bookmark', },
            { label: 'DRE', icon: 'pi pi-fw pi-bookmark', },
            { label: 'DMPL', icon: 'pi pi-fw pi-bookmark', },
            { label: 'DFC', icon: 'pi pi-fw pi-bookmark', },
            { label: 'Plano de Contas', icon: 'pi pi-fw pi-cog', to: `/companyConfig/${company.id}`},
            { label: 'Upload de Balancete', icon: 'pi pi-fw pi-upload', to:`/upload/${company.id}`}

        ]
    }))

    const baseMenu: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Empresas',
            items: companiesMenu
        },
        {
            label: "Configurações",
            items: [
                {label: "Usuarios", icon: 'pi pi-fw pi-users', to: '/users'},
                {label: "Empresas", icon: 'pi pi-fw pi-building', to: '/companies'},
                {label: "Grupo de empresas", icon: 'pi pi-fw pi-id-card', to: '/groupCompanies'},
            ]           
        },
    ];

    // Filtrar o menu baseado na role do usuário
    const filteredMenu = baseMenu.filter(item => {
        if (item.label === "Configurações") {
            return isCoordenador || isAdmin;
        }
        
        return true; // Manter todos os outros itens
    });

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {filteredMenu.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;