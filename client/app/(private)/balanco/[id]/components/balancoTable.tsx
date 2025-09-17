import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef } from "react";
import { Balanco } from "../../types";

//Formata para moeda BRL
const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(Number(value));
};

const BalancoTable = ({ balances , year, group}: any) => {
  const dt = useRef<DataTable<any>>(null);

  let titulo = '';
  if (group == 'ATIVO_CIRCULANTE') {titulo = 'Ativo Circulante';}
  else if (group == 'ATIVO_NAO_CIRCULANTE') {titulo = 'Ativo Não Circulante';}
  else if (group == 'PASSIVO_CIRCULANTE') {titulo = 'Passivo Circulante';}
  else if (group == 'PASSIVO_NAO_CIRCULANTE') {titulo = 'Passivo Não Circulante';}
  else if (group == 'PATRIMONIO_LIQUIDO') {titulo = 'Patrimônio Líquido';}
  else {titulo = 'Não agrupado';}

    const nameTemplate = (rowData: Balanco) => <span>{rowData.name}</span>;
    const atualTemplate = (rowData: Balanco) => <span>{formatCurrency(rowData.totalCurrentYear)}</span>;
    const anteriorTemplate = (rowData: Balanco) => <span>{formatCurrency(rowData.totalPreviousYear)}</span>;

    const header = (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">{titulo}</h5>
      </div>
    );

    const filteredBalances = balances?.filter((bal: Balanco) => bal.group === group) || [];

  return (
    <DataTable
      ref={dt}
      value={filteredBalances}
      // selection={selectedUsers}
      // onSelectionChange={(e) => setSelectedUsers(e.value as any)}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25]}
      className="datatable-responsive"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Balancos"
      emptyMessage="Nenhum Balanco encontrado."
      header={header}
      responsiveLayout="scroll"
      filterDisplay="row"
      
    >

      <Column field="name" header="Nomenclatura" sortable body={nameTemplate} headerStyle={{ minWidth: '15rem' }} />
      <Column field="totalCurrentYear" header={year} body={atualTemplate} sortable />
      <Column field="totalPreviousYear" header={year - 1} body={anteriorTemplate} sortable />
    </DataTable>
  )
}

export default BalancoTable;