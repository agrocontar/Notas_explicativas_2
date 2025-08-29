import { prisma } from "../prismaClient";

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
export const createBalancete = async (data: uploadInput) => {

  const balances = await prisma.balanceteData.createMany({
      data: data.balanceteData.map((row) => ({
        companyId: data.companyId,
        referenceDate: data.referenceDate,
        accountingAccount: row.accountingAccount.replace(/\W/g, ""), //Remove dots
        accountName: row.accountName,
        previousBalance: row.previousBalance,
        debit: row.debit,
        credit: row.credit,
        monthBalance: row.monthBalance,
        currentBalance: row.currentBalance,
      })),
    });

  return balances
}

// Search of Company and year
export const listBalancetePerYear = async (data: {companyId: string, year:number}) => {

  const balancetes = await prisma.balanceteData.findMany({
      where: {
        companyId: data.companyId,
        referenceDate: data.year
      }
    });

  if(!balancetes) throw new Error('Nenhum Balancete encontrado nessa empresa!')

  
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