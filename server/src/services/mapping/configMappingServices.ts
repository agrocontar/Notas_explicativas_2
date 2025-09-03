import { prisma } from "../../prismaClient"
import { NotFoundError } from "../../utils/errors"


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
      systemAccount: true,
    }
  })

  return configs
}