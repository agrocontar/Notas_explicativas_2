import { prisma } from "../prismaClient"


interface CreateCompanyInput {
  name: string
  cnpj: string
}

interface updateCompanyInput {
  companyId: string
  name?: string
  cnpj?: string
}

// Create Company
export const createCompany = async (data: CreateCompanyInput) => {

  const companyExists = await prisma.company.findFirst({ where: { name: data.name } })
  if (companyExists) throw new Error('Empresa já existe!')

  const company = prisma.company.create({ data })
  return company
}

// List Company
export const listCompanies = async () => {
  return prisma.company.findMany()
}


// List Companies per user group
export const listUserCompanies = async (userId: string) => {

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Usuário não encontrado!')

  const groupCompanies = await prisma.groupCompanies.findMany({
    where: {
      users: {
        some: {
          id: userId
        }
      }

    }, include: {
      companies: true
    }
  })

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

export const updateCompany = async ({ companyId, cnpj, name }: updateCompanyInput) => {
  if (!companyId) throw new Error("Id da empresa não informado");

  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) throw new Error("Empresa não encontrada");

  // verify if cnpj is active
  if (cnpj && company.cnpj !== cnpj) {

    const existingCompanyWithCnpj = await prisma.company.findFirst({
      where: {
        cnpj: cnpj,
        id: { not: companyId } // Except the current company
      }
    });

    if (existingCompanyWithCnpj) {
      throw new Error("CNPJ já está sendo utilizado por outra empresa");
    }
  }

  const data: any = {};

  if (cnpj) data.cnpj = cnpj;
  if (name) data.name = name;


  if (Object.keys(data).length === 0) {
    return company;
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data
  });

  return updatedCompany;
};

export const deleteCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new Error('Empresa não encontrada!')

  await prisma.company.delete({ where: { id: companyId } })

  return {
    id: company.id,
    name: company.name,
    cnpj: company.cnpj,
    createdAt: company.createdAt
  }
}