import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef } from "react";
import { Balancete } from "../types";

//Formata para moeda BRL
const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(Number(value));
};

const BalanceTable = ({ balanceAccounts, year}: any) => {
  const dt = useRef<DataTable<any>>(null);

    const contaTemplate = (rowData: Balancete) => <span>{rowData.accountingAccount}</span>;
    const nameTemplate = (rowData: Balancete) => <span>{rowData.accountName}</span>;
    const anteriorTemplate = (rowData: Balancete) => <span>{formatCurrency(rowData.previousBalance)}</span>;
    const debitoTemplate = (rowData: Balancete) => <span>{formatCurrency(rowData.debit)}</span>;
    const creditoTemplate = (rowData: Balancete) => <span>{formatCurrency(rowData.credit)}</span>;
    const mesTemplate = (rowData: Balancete) => <span>{formatCurrency(rowData.monthBalance)}</span>;
    const atualTemplate = (rowData: Balancete) => <span>{formatCurrency(rowData.currentBalance)}</span>;

    const header = (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Balancetes {year}</h5>
      </div>
    );

  return (
    <DataTable
      ref={dt}
      value={balanceAccounts}
      // selection={selectedUsers}
      // onSelectionChange={(e) => setSelectedUsers(e.value as any)}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25]}
      className="datatable-responsive"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
      emptyMessage="Nenhum usuário encontrado."
      header={header}
      responsiveLayout="scroll"
      filterDisplay="row"
      
    >
      <Column field="conta_contabil" header="Conta Contabil" sortable body={contaTemplate} headerStyle={{ minWidth: '15rem' }} />
      <Column field="nome" header="Nomenclatura" sortable body={nameTemplate} headerStyle={{ minWidth: '15rem' }} />
      <Column field="anterior" header="Saldo Anterior" body={anteriorTemplate} sortable />
      <Column field="debito" header="Debito" body={debitoTemplate} sortable />
      <Column field="credito" header="Credito" body={creditoTemplate} sortable />
      <Column field="month" header="Saldo do Mês" body={mesTemplate} sortable />
      <Column field="saldo" header="Saldo Atual" body={atualTemplate} sortable />
    </DataTable>
  )
}

export default BalanceTable;