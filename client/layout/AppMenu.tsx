/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useRef, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import api from '@/app/api/api';
import { Toast } from 'primereact/toast';

interface Companies {
    id: string
    name: string
    createdAt: string
}

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [companies, setCompanies] = useState<Companies[]>([])
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/companies/user');
                setCompanies(response.data);
            } catch (err) {
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: String(err), life: 3000 });
                }

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
        ]
    }))

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Empresas',
            items: companiesMenu
        },
        {
            label: 'Upload',
            items: [
                {label: 'Upload de Balancete', icon: 'pi pi-fw pi-upload', to: '/upload'}
            ]
        }

    ];

    return (
        <MenuProvider>
            <Toast ref={toast} />
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
