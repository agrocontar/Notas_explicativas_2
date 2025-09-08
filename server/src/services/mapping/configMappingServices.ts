import { prisma } from "../../prismaClient"
import { NotFoundError } from "../../utils/errors"
import { normalizeAccountingAccount } from "../../utils/normalizeAccountingAccount";

interface createMappingCompany {
  companyId: string;
  companyAccount: string;
  defaultAccountId: number;
}

interface updateMappingCompany {
  companyId: string;
  mappingId: number;
  companyAccount: string;
  defaultAccountId: number;
}


// List mapping of a company
export const listMappingCompany = async (companyId: string) => {

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

  const configs = await prisma.configMapping.findMany({
    where: {
      companyId
    },
    include: {
      company: true,
      defaultAccount: true,
    }
  })

  return configs
}



// Create mapping
export const createMappingCompany = async (data: createMappingCompany) => {
  const company = await prisma.company.findUnique({ where: { id: data.companyId } });
  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!");

  // Check if defaultAccount exists
  const systemAccount = await prisma.configTemplate.findUnique({
    where: { id: data.defaultAccountId }
  });
  if (!systemAccount) throw new NotFoundError("Conta padrão não encontrada!");

  // Check if the company account exists in ConfigCompany
  const normalizedAccount = normalizeAccountingAccount(data.companyAccount);
  const companyAccountExists = await prisma.configCompany.findUnique({
    where: {
      companyId_accountingAccount: {
        companyId: data.companyId,
        accountingAccount: normalizedAccount
      }
    }
  });

  if (!companyAccountExists) {
    throw new NotFoundError(
      `Conta ${normalizedAccount} não existe na empresa, Primeiro adicione a conta em ConfigCompany antes de mapeá-la.`
    );
  }

  // Create the mapping
  const mapping = await prisma.configMapping.create({
    data: {
      companyId: data.companyId,
      companyAccount: normalizedAccount,
      defaultAccountId: data.defaultAccountId
    }
  });

  return mapping;
};


export const updateMappingCompany = async (data: updateMappingCompany) => {

  //check if mapping exists
  const mapping = await prisma.configMapping.findUnique({ where: { id: data.mappingId } })
  if (!mapping) throw new NotFoundError(`Empresa com o ID ${data.mappingId} não existe no banco de dados!`)

  // check if company exists
  const company = await prisma.company.findUnique({where: { id: data.companyId }})
  if (!company) throw new NotFoundError("Empresa com este ID nao existe no banco de dados!")

  // check if defaultAccount exists
  const systemAccount = await prisma.configTemplate.findUnique({where: { id: data.defaultAccountId }})
  if (!systemAccount) throw new NotFoundError("Conta padrão não encontrada!")

  const normalizedAccount = normalizeAccountingAccount(data.companyAccount)

  const existing = await prisma.configMapping.findFirst({
    where: {
      companyId: data.companyId,
      companyAccount: normalizedAccount,
      NOT: { id: data.mappingId },
    },
  })
  if (!existing) throw new NotFoundError(`Já existe um mapeamento com a conta ${normalizedAccount} para esta empresa!`)
  
  const payload: any = {
    companyAccount: normalizedAccount,
    defaultAccountId: data.defaultAccountId
  }
  
  const updatedConfig = await prisma.configMapping.update({
    where: { id: data.mappingId},
    data: payload,
  });

  return updatedConfig
}


export const deleteMappingCompany = async (mappingId: number) => {

  //check if mapping exists
  const mapping = await prisma.configMapping.findUnique({ where: { id: mappingId } })
  if (!mapping) throw new NotFoundError(`Mapeamento com o ID ${mappingId} não existe no banco de dados!`)

  await prisma.configMapping.delete({ where: { id: mappingId } })

  return { message: "Mapeamento deletado com sucesso!" }
}
      