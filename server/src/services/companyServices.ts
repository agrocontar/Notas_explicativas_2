import { prisma } from "../prismaClient"

interface CreateCompanyInput {
  name: string
}

export const createCompany = async (data: CreateCompanyInput) => {

  const companyExists = await prisma.company.findFirst({ where: { name: data.name } })
  if (companyExists) throw new Error('Empresa já existe!')

  const company = prisma.company.create({ data })
  return company
}