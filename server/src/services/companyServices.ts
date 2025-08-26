import { prisma } from "../prismaClient"


interface CreateCompanyInput {
  name: string
}

// Create Company
export const createCompany = async (data: CreateCompanyInput) => {

  const companyExists = await prisma.company.findFirst({ where: { name: data.name } })
  if (companyExists) throw new Error('Empresa já existe!')

  const company = prisma.company.create({ data })
  return company
}

// List Company
export const listCompanies = async() => {
  return prisma.company.findMany()
}
