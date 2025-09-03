interface CompanyConfigPageProps {
  params: {
    id: string
  }
}

const CompanyConfigPage = ({ params }: CompanyConfigPageProps) => {
  return (
    <div>
      <h1>Company Config</h1>
      <p>ID da empresa: {params.id}</p>
    </div>
  )
}

export default CompanyConfigPage