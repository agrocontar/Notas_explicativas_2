import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../prismaClient";
import { NotFoundError } from "../utils/errors";
import { processMappedData } from "../utils/processMappeddata";

interface uploadInput {
  companyId: string
  referenceDate: number
  balanceteData:
    { 
      accountingAccount: string,
      accountName: string,
      previousBalance: number,
      debit: number,
      credit: number,
      monthBalance: number,
      currentBalance: number,
  }[]
}

// Create Balancetes
// Create Balancetes
export const createBalancete = async (data: uploadInput) => {
  const company = await prisma.company.findUnique({
    where: { id: data.companyId }
  });

  if (!company) throw new NotFoundError("Empresa com este ID não existe no banco de dados!");

  // Buscar mapeamentos da empresa
  const mappings = await prisma.configMapping.findMany({
    where: { companyId: data.companyId },
    include: {
      defaultAccount: true
    }
  });

  // Processar mapeamentos e somar valores
  const processedData = processMappedData(data.balanceteData, mappings);

  // Verificar se já existe balancete para esta empresa e data de referência
  const existingBalancete = await prisma.balanceteData.findFirst({
    where: {
      companyId: data.companyId,
      referenceDate: data.referenceDate
    }
  });

  // Se existir, deletar todos os registros para esta empresa e data
  if (existingBalancete) {
    await prisma.balanceteData.deleteMany({
      where: {
        companyId: data.companyId,
        referenceDate: data.referenceDate
      }
    });
  }

  // Criar os novos registros do balancete
  const balances = await prisma.balanceteData.createMany({
    data: processedData.map((row) => ({
      companyId: data.companyId,
      referenceDate: data.referenceDate,
      accountingAccount: row.accountingAccount.replace(/\W/g, ""),
      accountName: row.accountName,
      previousBalance: row.previousBalance,
      debit: row.debit,
      credit: row.credit,
      monthBalance: row.monthBalance,
      currentBalance: row.currentBalance,
    })),
  });

  return balances;
};

// Search of Company and year
export const listBalancetePerYear = async (data: {companyId: string, year:number}) => {

  const balancetes = await prisma.balanceteData.findMany({
      where: {
        companyId: data.companyId,
        referenceDate: data.year
      }
    });

  if(!balancetes) throw new NotFoundError('Nenhum Balancete encontrado nessa empresa!')

  
  return balancetes
}

export const listBalancetesCompany = async (companyId: string) => {

  try {
    const balancetes = await prisma.balanceteData.findMany({
       where: {
      companyId,
      },
      orderBy: {
        referenceDate: 'desc'
      }
    })

    return balancetes
  } catch (error) {
    console.log(Error)
    return error
  }
}