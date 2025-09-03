import TemplateList from "./components/templateList"

interface CompanyConfigPageProps {
  params: {
    id: string
  }
}

const CompanyConfigPage = ({ params }: CompanyConfigPageProps) => {

  
  return (
    
    <div className="grid">
          <div className="col-12">
              <div className="card">
                  <TemplateList />
              </div>
          </div>
      </div>
      
    
  )
}

export default CompanyConfigPage