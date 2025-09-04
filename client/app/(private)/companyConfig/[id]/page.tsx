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
          <TemplateList companyId={params.id} initialData={initialData} />
        </div>
        <div className="card">
          <MappingTable companyId={params.id}/>
        </div>
      </div>
    </div>
  )
}

export default CompanyConfigPage