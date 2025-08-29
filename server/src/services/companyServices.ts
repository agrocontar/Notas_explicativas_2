import { prisma } from "../prismaClient"


interface CreateCompanyInput {
  name: string
  cnpj: string
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


// List Companies per user group
export const listUserCompanies = async( userId: string) => {

  const user = await prisma.user.findUnique({where: {id: userId}})
  if(!user) throw new Error('Usuário não encontrado!')

  const groupCompanies = await prisma.groupCompanies.findMany({where: {
    users: {
      some: {
        id: userId
      }
    }
    
  }, include: {
    companies: true
  }})

  // Flatter and remove duplicateds
  const companyMap = new Map<string, typeof groupCompanies[0]['companies'][0]>();
  groupCompanies.forEach(group => {
    group.companies.forEach(company => {
      companyMap.set(company.id, company);
    });
  });

  const uniqueCompanies = Array.from(companyMap.values());

  return uniqueCompanies
}