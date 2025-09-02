import React, { useState, useEffect, useMemo } from 'react';
import { PickList } from 'primereact/picklist';
import api from '@/app/api/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersListProps {
  users: User[];
  allUsers?: User[]; // Opcional: se você tiver acesso a todos os usuários
}

export default function UsersList({ users, allUsers }: UsersListProps) {
    const [allUsersList, setAllUsersList] = useState<User[]>(allUsers || []);
    const [target, setTarget] = useState<User[]>([]);

    // Filtrar source para mostrar apenas usuários não vinculados ao grupo
    const source = useMemo(() => {
        return allUsersList.filter(user => 
            !target.some(targetUser => targetUser.id === user.id)
        );
    }, [allUsersList, target]);

    // Se você não tem acesso a todos os usuários via prop, pode buscar da API
    const fetchAllUsers = async () => {
        try {
            const res = await api.get('/users');
            const data = await res.data;

            if (!res.status) {
                console.error('Erro ao buscar as empresas:', data.error);
                return;
            }
            setAllUsersList(data);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
        }
    };

    useEffect(() => {
        // Se não receber allUsers via prop, busca da API
        if (!allUsers) {
            fetchAllUsers();
        } else {
            setAllUsersList(allUsers);
        }
        setTarget(users);
    }, [users, allUsers]);

    const onChange = (event: any) => {
        setAllUsersList(event.source.concat(event.target));
        setTarget(event.target);
    };

    const itemTemplate = (item: User) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex flex-column">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.email}</span>
                    <span className="text-xs text-gray-400">({item.role})</span>
                </div>
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
                sourceHeader="Usuários Disponíveis" 
                targetHeader="Usuários do Grupo" 
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