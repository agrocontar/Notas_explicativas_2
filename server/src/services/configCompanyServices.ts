import { prisma } from "../prismaClient";
import { NotFoundError } from "../utils/errors";

interface createConfigInput {
  companyId: string
  configs: {
    accountingAccount: string,
    accountName: string,
  }[]
}

// Create Config with json
export const createConfig = async (data: createConfigInput) => {

  const company = await prisma.company.findUnique({where: { id: data.companyId }})
  if (!company) throw new NotFoundError("Empresa com este ID nao existe no banco de dados!")

  const configsOfCompanies = await prisma.configCompany.findMany({where: { companyId: data.companyId }})
  if (configsOfCompanies) throw new NotFoundError("Já existe Configurações para essa empresa!")

  const config = await prisma.configCompany.createMany({
    data: data.configs.map((row) => ({
      companyId: data.companyId,
      accountingAccount: row.accountingAccount,
      accountName: row.accountName
    })),
  });

  return config
}


// List all configs
export const listConfigCompanies = async () => {

  const configs = await prisma.configCompany.findMany({
    include: {
      company: true
    }
  })

  return configs
}


// List configs of a company
export const listConfigCompany = async (companyId: string) => {

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  const configs = await prisma.configCompany.findMany({
    where: {
      companyId
    },
    include: {
      company: true
    }
  })

  return configs
}

//update configs of a company
export const updateConfigCompany = async (data: createConfigInput) => {

  const company = await prisma.company.findUnique({ where: { id: data.companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  // delete all current configs of company
  await prisma.configCompany.deleteMany({
    where: { companyId: data.companyId }
  })

  // create new configs
  const configs = await prisma.configCompany.createMany({
    data: data.configs.map((row) => ({
      companyId: data.companyId,
      accountingAccount: row.accountingAccount,
      accountName: row.accountName,
    }))
  })

  return configs
}