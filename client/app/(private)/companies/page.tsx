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

interface Company {
  id: string;
  name: string;
  cnpj: string;
}


const CompaniesPage = () => {
  const emptyCompany = {
    id: '',
    name: '',
    cnpj: '',
  };

  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company>(emptyCompany);

  const [companyDialog, setCompanyDialog] = useState(false);
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
  const fetchUsers = async () => {
    try {
      const res = await api.get('/companies');
      const data = await res.data;

      if (!res.status) {
        console.error('Erro ao buscar as empresas:', data.error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar os empresas.',
          life: 3000,
        });
        return;
      }

      setCompanies(data);
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //Abre o dialogo de novo usuario
  const openNew = () => {
    setCompany(emptyCompany);
    setSubmitted(false);
    setCompanyDialog(true);
  };

  const openEdit = (company: Company) => {
    setCompany({ ...company });
    setSubmitted(false);
    setEditUserDialog(true);
  };

  // esconde o diagolo 
  const hideDialog = () => {
    setSubmitted(false);
    setCompanyDialog(false);
  };

  // esconde o dialogo de editar usuario
  const hideEditUserDialog = () => {
    setSubmitted(false);
    setEditUserDialog(false);
  };

  // esconde o dialogo de deletar usuario
  const hideDeleteProductDialog = () => setDeleteUserDialog(false);

  // Salva o usuario
  const saveCompany = async () => {
    setSubmitted(true);

    const requiredFields = [
      { id: 'cnpj', label: 'CPF/CNPJ', value: company.cnpj?.trim() },
    ];

    const invalidField = requiredFields.find(field => !field.value);

    if (invalidField) {
      const el = document.getElementById(invalidField.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Preencha todos os campos obrigatórios',
        detail: `O campo "${invalidField.label}" precisa ser preenchido.`,
        life: 4000,
      });

      return;
    }

    if (company.cnpj && ![11, 14].includes(company.cnpj.replace(/\D/g, '').length)) {
      const el = document.getElementById('cnpj');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }
      toast.current?.show({
        severity: 'error',
        summary: 'Documento Inválido',
        detail: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.',
        life: 4000,
      });
      return;
    }

    let _companies = [...companies];
    let _company = { ...company };

    if (company.id) {
      const index = findIndexById(company.id);
      _companies[index] = _company;
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Empresa Atualizada',
        life: 3000,
      });
      setCompanies(_companies);
    } else {
      try {

        const payload = {
          name: company.name,
          cnpj: company.cnpj,
        }

        const res = await api.post('/companies', payload);

        if (!res.status) {
          throw new Error(res.data.error || 'Erro ao criar Empresa');
        }
        const createdCompany = await res.data
        _company.id = createdCompany.id; // assumindo que o back retorna o ID
        _companies.push(_company);

        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Empresa Criado',
          life: 3000,
        });

        setCompanies(_companies);
      } catch (err: any) {
        console.error('Erro ao criar Empresa:', err);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: err.response.data.error || err.response.data.errors[0].message || 'Erro ao criar Empresa',
          life: 3000,
        });
        return;
      }


      setCompanyDialog(false);
      setCompany(emptyCompany);
    }
  };

  // Edita o usuario
  const editCompany = async () => {
    if (!company.id) return;

    
    const requiredFields = [
      { id: 'cnpj', label: 'CPF/CNPJ', value: company.cnpj?.trim() },
    ];

    const invalidField = requiredFields.find(field => !field.value);

    if (invalidField) {
      const el = document.getElementById(invalidField.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Preencha todos os campos obrigatórios',
        detail: `O campo "${invalidField.label}" precisa ser preenchido.`,
        life: 4000,
      });

      return;
    }

    if (company.cnpj && ![11, 14].includes(company.cnpj.replace(/\D/g, '').length)) {
      const el = document.getElementById('cnpj');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }
      toast.current?.show({
        severity: 'error',
        summary: 'Documento Inválido',
        detail: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.',
        life: 4000,
      });
      return;
    }

    try {

      const payload = {
        name: company.name,
        cnpj: company.cnpj,
      }

      const res = await api.put(`/companies/${company.id}`, payload);
      const data = res.data



      if (!res.status) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: res.data.error || 'Erro ao editar o empresa.',
          life: 3000,
        });
        return;
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'empresa atualizado com sucesso.',
        life: 3000,
      });

      // Atualiza lista local
      const updatedCompanies = companies.map((u) => (u.id === company.id ? data : u));
      setCompanies(updatedCompanies);
      setCompany(data);
      setEditUserDialog(false);
      setCompany(emptyCompany);

    } catch (err) {
      console.error('Erro ao editar empresa:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro inesperado ao editar empresa.',
        life: 3000,
      });
    }
  };

  // Deleta o usuario
  const deleteCompany = async () => {
    if (!company.id) return;
    setLoading(true);
    try {

      const res = await api.delete(`/companies/${company.id}`);
      const data = res.data

      if (!res.status) {
        console.log(res)
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: data.error || 'Erro ao Excluir a empresa.',
          life: 3000,
        });
        return;
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Empresa excluido com sucesso.',
        life: 3000,
      });

      // Atualiza lista local
      const updatedCompanies = companies.map((u) => (u.id === company.id ? data : u));
      setCompanies(updatedCompanies);
      setCompany(data);
      setSelectedUsers(null);
      setDeleteUserDialog(false);
      fetchUsers()
      setCompany(emptyCompany);
      setLoading(false)

    } catch (err) {
      console.error('Erro ao excluir empresa:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro inesperado ao excluir empresa.',
        life: 3000,
      });
    }
  };


  // Confirma a exclusão do usuario
  const confirmDeleteProduct = (company: Company) => {
    setCompany(company);
    setDeleteUserDialog(true);
  };

  const findIndexById = (id: string) => companies.findIndex((u) => u.id === id);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || '';
    setCompany({ ...company, [name]: val });
  };


  const nameBodyTemplate = (rowData: Company) => <span>{rowData.name}</span>;
  const cnpjBodyTemplate = (rowData: Company) => <span>{rowData.cnpj}</span>;


  const actionBodyTemplate = (rowData: Company) => {
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
      <Button label="Nova Empresa" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
    </div>
  );


  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Cadastro de Empresas</h5>
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
      <Button label="Salvar" icon="pi pi-check" text onClick={saveCompany} />
    </>
  );

  const editUserDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideEditUserDialog} />
      <Button label="Salvar" icon="pi pi-check" text onClick={editCompany} />
    </>
  );

  const deleteUserDialogFooter = (
    <>
      <Button label="Não" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
      <Button label="Sim" icon="pi pi-check" text onClick={deleteCompany} />
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
              value={companies}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value as any)}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Empresas"
              emptyMessage="Nenhum usuário encontrado."
              header={header}
              responsiveLayout="scroll"
              filters={filters}
              filterDisplay="row"
              globalFilterFields={['name', 'cnpj', 'role']}
            >
              <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
              <Column field="cnpj" header="Cnpj" sortable body={cnpjBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
              <Column body={actionBodyTemplate} header="Ações" headerStyle={{ minWidth: '10rem' }} />
            </DataTable>
          )}

          <Dialog visible={companyDialog} style={{ width: '450px' }} header="Novo Usuário" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={company.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !company.name })}
              />
              {submitted && !company.name && <small className="p-invalid">O nome é obrigatório</small>}
            </div>

            <div className="field">
              <label htmlFor="cnpj">CNPJ/CPF <span style={{ color: 'red' }}>*</span></label>
              <InputText
                id="cnpj"
                value={company.cnpj}
                onChange={(e) => onInputChange(e, 'cnpj')}
                placeholder="Digite somente números"
                onBlur={(e) => {
                  const digits = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
                  let maskedValue = digits;

                  if (digits.length === 11) { // CPF
                    maskedValue = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                  } else if (digits.length === 14) { // CNPJ
                    maskedValue = digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                  }
                  // Se não for nem 11 nem 14, mantém sem formatação (será validado depois)

                  setCompany({ ...company, cnpj: maskedValue });
                }}
                className={classNames({ 'p-invalid': submitted && !company.name })}
                required
              />
              {submitted && !company.cnpj && <small className="p-invalid">CPF/CNPJ é obrigatório!</small>}
              {company.cnpj && ![11, 14].includes(company.cnpj.replace(/\D/g, '').length) && (
                <small className="p-invalid">Documento inválido (CPF 11 dígitos, CNPJ de 14)</small>
              )}
            </div>


          </Dialog>

          <Dialog visible={editUserDialog} style={{ width: '450px' }} header="Editar Usuário" modal className="p-fluid" footer={editUserDialogFooter} onHide={hideEditUserDialog}>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={company.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !company.name })}
              />
              {submitted && !company.name && <small className="p-invalid">O nome é obrigatório</small>}
            </div>

            <div className="field">
              <label htmlFor="cnpj">CNPJ/CPF <span style={{ color: 'red' }}>*</span></label>
              <InputText
                id="cnpj"
                value={company.cnpj}
                onChange={(e) => onInputChange(e, 'cnpj')}
                placeholder="Digite somente números"
                onBlur={(e) => {
                  const digits = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
                  let maskedValue = digits;

                  if (digits.length === 11) { // CPF
                    maskedValue = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                  } else if (digits.length === 14) { // CNPJ
                    maskedValue = digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                  }
                  // Se não for nem 11 nem 14, mantém sem formatação (será validado depois)

                  setCompany({ ...company, cnpj: maskedValue });
                }}
                className={classNames({ 'p-invalid': submitted && !company.name })}
                required
              />
              {submitted && !company.cnpj && <small className="p-invalid">CPF/CNPJ é obrigatório!</small>}
              {company.cnpj && ![11, 14].includes(company.cnpj.replace(/\D/g, '').length) && (
                <small className="p-invalid">Documento inválido (CPF 11 dígitos, CNPJ de 14)</small>
              )}
            </div>
          </Dialog>

          <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteProductDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" />
              {company && <span>Tem certeza que deseja excluir <b>{company.name}</b>?</span>}
            </div>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
