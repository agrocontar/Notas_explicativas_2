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
  onUsersChange: (users: User[]) => void;
}

export default function UsersList({ users, onUsersChange }: UsersListProps) {
    const [allUsersList, setAllUsersList] = useState<User[]>([]);
    const [target, setTarget] = useState<User[]>([]);

    const source = useMemo(() => {
        return allUsersList.filter(user => 
            !target.some(targetUser => targetUser.id === user.id)
        );
    }, [allUsersList, target]);

    const fetchAllUsers = async () => {
        try {
            const res = await api.get('/users');
            const data = await res.data;
            setAllUsersList(data);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
        }
    };

    useEffect(() => {
        fetchAllUsers();
        setTarget(users);
    }, [users]);

    const onChange = (event: any) => {
        setAllUsersList(event.source.concat(event.target));
        setTarget(event.target);
        onUsersChange(event.target); // Notifica o componente pai
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