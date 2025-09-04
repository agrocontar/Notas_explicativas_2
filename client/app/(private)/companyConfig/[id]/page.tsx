import MappingTable from "./components/MappingTable";
import TemplateList from "./components/TemplateList";
import { getCompanyData } from "./components/TemplateList/actions";


interface CompanyConfigPageProps {
  params: {
    id: string
  }
}

const CompanyConfigPage = async ({ params }: CompanyConfigPageProps) => {
  // Get initial data of the company
  const initialData = await getCompanyData(params.id);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="mb-4 p-2 border-bottom-1 surface-border">

            <h2>Configuração do Plano de Contas</h2>
          </div>
          <TemplateList companyId={params.id} initialData={initialData} />
        </div>
        <div className="card">
          <div className="mb-4 p-2 border-bottom-1 surface-border"  >

            <h2>Mapeamentos</h2>
          </div>
          <MappingTable companyId={params.id} />
        </div>
      </div>
    </div>
  )
}

export default CompanyConfigPage