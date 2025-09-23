import { prisma } from "../prismaClient"
import { NotFoundError } from "../utils/errors"
import { normalizeAccountingAccount } from "../utils/normalizeAccountingAccount"

export interface BalancoWithTotals {
  id: number
  name: string
  group: string
  accountingAccounts: string[]
  createdAt: Date
  updatedAt: Date
  totalAnoAtual: number
  totalAnoAnterior: number
  contasEncontradasAnoAtual: number
  contasEncontradasAnoAnterior: number
}

export const listBalancoWithTotals = async (data: { companyId: string, year: number }) => {
  try {
    // Buscar todos os itens de balanço
    const balancos = await prisma.balancoTemplate.findMany({
      orderBy: {
        group: 'asc'
      }
    })

    if (!balancos || balancos.length === 0) {
      throw new NotFoundError('Nenhum item de balanço encontrado!')
    }

    // Buscar balancetes do ano atual e do ano anterior
    const [balancetesAnoAtual, balancetesAnoAnterior] = await Promise.all([
      prisma.balanceteData.findMany({
        where: {
          companyId: data.companyId,
          referenceDate: data.year // Ano atual (2025)
        }
      }),
      prisma.balanceteData.findMany({
        where: {
          companyId: data.companyId,
          referenceDate: data.year - 1 // Ano anterior (2024)
        }
      })
    ])

    if (!balancetesAnoAtual.length && !balancetesAnoAnterior.length) {
      throw new NotFoundError('Nenhum balancete encontrado para os anos especificados!')
    }

    // Calcular os totais para cada item do balanço
    const balancosWithTotals: BalancoWithTotals[] = await Promise.all(
      balancos.map(async (balanco: any) => {
        // Filtrar balancetes do ano atual
        const balancetesAnoAtualFiltrados = balancetesAnoAtual.filter(balancete =>
          balanco.accountingAccounts.some((accountCode: string) =>
            balancete.accountingAccount === normalizeAccountingAccount(accountCode)
          )
        )

        // Filtrar balancetes do ano anterior
        const balancetesAnoAnteriorFiltrados = balancetesAnoAnterior.filter(balancete =>
          balanco.accountingAccounts.some((accountCode: string) =>
            balancete.accountingAccount === normalizeAccountingAccount(accountCode)
          )
        )

        // Somar os currentBalance dos balancetes filtrados
        const totalCurrentYear = parseFloat(balancetesAnoAtualFiltrados.reduce((sum, balancete) => {
          return sum + Number(balancete.currentBalance)
        }, 0).toFixed(2))

        const totalPreviousYear = parseFloat(balancetesAnoAnteriorFiltrados.reduce((sum, balancete) => {
          return sum + Number(balancete.currentBalance)
        }, 0).toFixed(2))

        return {
          ...balanco,
          accountingAccounts: balanco.accountingAccounts.map((accountCode:any)  => normalizeAccountingAccount(accountCode)),
          totalCurrentYear,
          totalPreviousYear,
        }
      })
    )

    return balancosWithTotals
  } catch (error) {
    console.error('Error in listBalancoWithTotals:', error)
    throw error
  }
}
