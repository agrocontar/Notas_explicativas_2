
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface usersListProps {
  users: User[];
}

export default function UsersList({ users }: usersListProps){
    const [source, setSource] = useState<User[]>([]);
    const [target, setTarget] = useState<User[]>([]);

    useEffect(() => {
        setSource([]);
        setTarget(users);
    }, [users]); 

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
                sourceHeader="Usuários Disponíveis" targetHeader="Usuários do Grupo" sourceStyle={{ height: '18rem' }} targetStyle={{ height: '18rem' }}
                sourceFilterPlaceholder="Buscar por nome" targetFilterPlaceholder="Buscar por nome" showSourceControls={false} showTargetControls={false} />
        </div>
    );
}
        