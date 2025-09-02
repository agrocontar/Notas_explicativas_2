/* eslint-disable @next/next/no-img-element */
'use client';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import api from '@/app/api/api';
import PermissionList from './components/permissionsList';

export interface GroupCompanies {
  id: string;
  name: string;
  companies: {
    id: string;
    name: string;
    cnpj: string;
  }[]
}

const GroupCompaniesPage = () => {
  const emptyGroup = {
    id: '',
    name: '',
    companies: [{
    id: '',
    name: '',
    cnpj: '',
    }]
  };

  const [groupCompaniesArray, setGroupCompaniesArray] = useState<GroupCompanies[]>([]);
  const [groupCompanies, setGroupCompanies] = useState<GroupCompanies>(emptyGroup);

  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);


  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS }
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
  };

  // BUsca a lista de usuarios
  const fetchGroups = async () => {
    try {
      const res = await api.get('/groupCompanies');
      const data = await res.data;

      if (!res.status) {
        console.error('Erro ao buscar os Grupos de Empresas:', data.error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar os Grupos de Empresas.',
          life: 3000,
        });
        return;
      }

      setGroupCompaniesArray(data);
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  //Abre o dialogo de novo usuario
  const openNew = () => {
    setGroupCompanies(emptyGroup);
    setSubmitted(false);
    setUserDialog(true);
  };

  //Abre o dialogo de editar usuario
  const openEdit = (user: GroupCompanies) => {
    setGroupCompanies({ ...user });
    setSubmitted(false);
    setEditUserDialog(true);
  };

  // esconde o diagolo 
  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  // esconde o dialogo de editar usuario
  const hideEditUserDialog = () => {
    setSubmitted(false);
    setEditUserDialog(false);
  };

  // esconde o dialogo de deletar usuario
  const hideDeleteProductDialog = () => setDeleteUserDialog(false);

  // Salva o usuario
  const saveGroup = async () => {
    setSubmitted(true);

    if (groupCompanies.name.trim()) {
      let _users = [...groupCompaniesArray];
      let _user = { ...groupCompanies };

      if (groupCompanies.id) {
        const index = findIndexById(groupCompanies.id);
        _users[index] = _user;
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo Atualizado',
          life: 3000,
        });
        setGroupCompaniesArray(_users);
      } else {
        try {

          const payload = {
            name: groupCompanies.name,
          }

          const res = await api.post('/groupCompanies', payload);

          if (!res.status) {
            throw new Error(res.data.error || 'Erro ao criar Grupo');
          }
          const createdUser = await res.data
          _user.id = createdUser.id; // assumindo que o back retorna o ID
          _users.push(_user);

          toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Grupo Criado',
            life: 3000,
          });

          setGroupCompaniesArray(_users);
        } catch (err: any) {
          console.error('Erro ao criar Grupo:', err);
          toast.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: err.response.data.error || err.response.data.errors[0].message || 'Erro ao criar Grupo',
            life: 3000,
          });
          return;
        }
      }

      setUserDialog(false);
      setGroupCompanies(emptyGroup);
    }
  };

  // Edita o usuario
  const editGroup = async () => {
    if (!groupCompanies.id) return;

    try {

      const payload = {
        name: groupCompanies.name,
      }

      const res = await api.put(`/groupCompanies/${groupCompanies.id}`, payload);
      const data = res.data



      if (!res.status) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: res.data.error || 'Erro ao editar o Grupo.',
          life: 3000,
        });
        return;
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Grupo atualizado com sucesso.',
        life: 3000,
      });

      // Atualiza lista local
      const updatedUsers = groupCompaniesArray.map((u) => (u.id === groupCompanies.id ? data : u));
      setGroupCompaniesArray(updatedUsers);
      setGroupCompanies(data);
      setEditUserDialog(false);
      setGroupCompanies(emptyGroup);

    } catch (err) {
      console.error('Erro ao editar Grupo:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro inesperado ao editar Grupo.',
        life: 3000,
      });
    }
  };

  // Deleta o usuario
  const deleteGroup = async () => {
    if (!groupCompanies.id) return;
    setLoading(true);
    try {

      const res = await api.delete(`/groupCompanies/${groupCompanies.id}`);
      const data = res.data

      if (!res.status) {
        console.log(res)
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: data.error || 'Erro ao Excluir o Grupo.',
          life: 3000,
        });
        return;
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Grupo excluido com sucesso.',
        life: 3000,
      });

      // Atualiza lista local
      const updatedUsers = groupCompaniesArray.map((u) => (u.id === groupCompanies.id ? data : u));
      setGroupCompaniesArray(updatedUsers);
      setGroupCompanies(data);
      setSelectedUsers(null);
      setDeleteUserDialog(false);
      fetchGroups()
      setGroupCompanies(emptyGroup);
      setLoading(false)

    } catch (err) {
      console.error('Erro ao excluir Grupo:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro inesperado ao excluir Grupo.',
        life: 3000,
      });
    }
  };


  // Confirma a exclusão do usuario
  const confirmDeleteProduct = (user: GroupCompanies) => {
    setGroupCompanies(user);
    setDeleteUserDialog(true);
  };

  const findIndexById = (id: string) => groupCompaniesArray.findIndex((u) => u.id === id);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || '';
    setGroupCompanies({ ...groupCompanies, [name]: val });
  };


  const nameBodyTemplate = (rowData: GroupCompanies) => <span>{rowData.name}</span>;


  const actionBodyTemplate = (rowData: GroupCompanies) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          severity="info"
          className="mr-2"
          onClick={() => openEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  }


  const leftToolbarTemplate = () => (
    <div className="my-2">
      <Button label="Novo Grupo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
    </div>
  );


  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Cadastro de Grupos de Empresas</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={filters.global.value}
          onChange={onGlobalFilterChange}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const UserDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Salvar" icon="pi pi-check" text onClick={saveGroup} />
    </>
  );

  const editUserDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideEditUserDialog} />
      <Button label="Salvar" icon="pi pi-check" text onClick={editGroup} />
    </>
  );

  const deleteUserDialogFooter = (
    <>
      <Button label="Não" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
      <Button label="Sim" icon="pi pi-check" text onClick={deleteGroup} />
    </>
  );




  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">

          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate} />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <ProgressSpinner
                style={{ width: '60px', height: '60px' }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </div>
          ) : (
            <DataTable
              ref={dt}
              value={groupCompaniesArray}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value as any)}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Grupos de Empresas"
              emptyMessage="Nenhum Grupo encontrado."
              header={header}
              responsiveLayout="scroll"
              filters={filters}
              filterDisplay="row"
              globalFilterFields={['name', 'email', 'role']}
            >
              <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
              <Column body={actionBodyTemplate} header="Ações" headerStyle={{ minWidth: '10rem' }} />
            </DataTable>
          )}

          <Dialog visible={userDialog} style={{ width: '450px' }} header="Novo Grupo" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={groupCompanies.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !groupCompanies.name })}
              />
              {submitted && !groupCompanies.name && <small className="p-invalid">O nome é obrigatório</small>}
            </div>
          </Dialog>

          <Dialog visible={editUserDialog} style={{ width: '450px' }} header="Editar Grupo" modal className="p-fluid" footer={editUserDialogFooter} onHide={hideEditUserDialog}>
            <PermissionList companies={groupCompanies.companies}/>
          </Dialog>

          <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteProductDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" />
              {groupCompanies && <span>Tem certeza que deseja excluir <b>{groupCompanies.name}</b>?</span>}
            </div>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default GroupCompaniesPage;
