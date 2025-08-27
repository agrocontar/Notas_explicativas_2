import { prisma } from "../prismaClient";

interface uploadInput {
  companyId: string
  referenceDate: string
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
        referenceDate: new Date(data.referenceDate),
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
