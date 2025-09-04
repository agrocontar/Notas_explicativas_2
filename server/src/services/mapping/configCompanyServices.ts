import { prisma } from "../../prismaClient";
import { NotFoundError } from "../../utils/errors";
import { normalizeAccountingAccount } from "../../utils/normalizeAccountingAccount";

interface createConfigInput {
  companyId: string
  configs: {
    accountingAccount: string,
    accountName: string,
  }[]
}

// Create Config with json
export const createConfig = async (data: createConfigInput) => {

  const company = await prisma.company.findUnique({ where: { id: data.companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID nao existe no banco de dados!")

  const config = await prisma.configCompany.createMany({
    data: data.configs.map((row) => ({
      companyId: data.companyId,
      accountingAccount: normalizeAccountingAccount(row.accountingAccount),
      accountName: row.accountName
    })),
  });

  return config
}


// List configs of a company that are not yet mapped
export const listConfigCompany = async (companyId: string) => {

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  const unmappedConfigs = await prisma.configCompany.findMany({
    where: {
      companyId,
      // Filtra apenas as configurações que não têm mapeamento
      ConfigMapping: {
        none: {} // Nenhum mapeamento relacionado existe
      }
    },
    include: {
      // Inclui informações adicionais se necessário
      company: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return unmappedConfigs
}

//update configs of a company
export const updateConfigCompany = async (data: createConfigInput) => {

  const company = await prisma.company.findUnique({ where: { id: data.companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  const accounts = data.configs.map(c => c.accountingAccount)
  const duplicates = accounts.filter((item, idx) => accounts.indexOf(item) !== idx)

  if (duplicates.length > 0) {
    throw new NotFoundError(`Existe contas com o mesmo codigo na lista, codigos: ${[...new Set(duplicates)].join(', ')}`)
  }

  // delete all current configs of company
  await prisma.configCompany.deleteMany({
    where: { companyId: data.companyId }
  })

  // create new configs
  const configs = await prisma.configCompany.createMany({
    data: data.configs.map((row) => ({
      companyId: data.companyId,
      accountingAccount: normalizeAccountingAccount(row.accountingAccount),
      accountName: row.accountName,
    }))
  })

  return configs
}

