import { prisma } from "../prismaClient";
import { NotFoundError } from "../utils/errors";

interface createConfigInput {
  companyId: string
  configs: {
    accountingAccount: string,
    accountName: string,
  }[]
}

export const createConfig = async (data:createConfigInput) => {

   const company = await prisma.company.findUnique({
      where: {id: data.companyId}
    })
  
    if(!company) throw new NotFoundError("Empresa com este ID nao existe no banco de dados!")
  
    const config = await prisma.configCompany.createMany({
        data: data.configs.map((row) => ({
          companyId: data.companyId,
          accountingAccount: row.accountingAccount,
          accountName: row.accountName
        })),
      });
  
    return config
}



export const listConfigCompanies = async () => {

    const configs = await prisma.configCompany.findMany({
      include: {
        company: true
      }
    })

    return configs
}



export const listConfigCompany = async (companyId: string) => {

    const company = await prisma.company.findUnique({where: {id: companyId}})
    if(!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!")

    const configs = await prisma.configCompany.findMany({
      where:{
        companyId
      },
      include: {
        company: true
      }
    })

    return configs
}