import { prisma } from "../prismaClient"
import { NotFoundError } from "../utils/errors"

export interface BalancoWithTotal {
  id: string
  name: string
  group: string
  accountingAccounts: string[]
  total: number
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateBalancoData {
  name: string
  group: string
  accountingAccounts: string[]
}


export const createBalanco = async (data: CreateBalancoData) => {
  try {

    // Validar se o grupo é válido
    const validGroups = ['ATIVO_CIRCULANTE', 'ATIVO_NAO_CIRCULANTE', 'PASSIVO_CIRCULANTE', 'PASSIVO_NAO_CIRCULANTE', 'PATRIMONIO_LIQUIDO']
    
    if (!validGroups.includes(data.group)) {
      throw new Error('Grupo inválido! Os grupos válidos são: ATIVO_CIRCULANTE, ATIVO_NAO_CIRCULANTE, PASSIVO_CIRCULANTE, PASSIVO_NAO_CIRCULANTE, PATRIMONIO_LIQUIDO')
    }

    // Validar se há accountingAccounts
    if (!data.accountingAccounts || data.accountingAccounts.length === 0) {
      throw new Error('É necessário informar pelo menos uma conta contábil!')
    }

    // Criar o balanço
    const balanco = await prisma.balancoTemplate.create({
      data: {
        name: data.name,
        group: data.group as any, // Cast para o enum do Prisma
        accountingAccounts: data.accountingAccounts,
      }
    })

    return balanco
  } catch (error:any) {
    console.error('Error in createBalanco:', error)
    
    // Se já for um erro conhecido, apenas propaga
    if (error instanceof NotFoundError ) {
      throw error
    }
    
    // Para outros erros, lança um erro genérico
    throw new Error('Erro ao criar balanço: ' + error.message)
  }
}


export const listBalancoWithTotals = async (data: { companyId: string, year: number }) => {
  try {
    // Buscar todos os itens de balanço da empresa
    const balancos = await prisma.balancoTemplate.findMany({
      orderBy: {
        group: 'asc'
      }
    })

    if (!balancos || balancos.length === 0) {
      throw new NotFoundError('Nenhum item de balanço encontrado!')
    }

    // Buscar todos os balancetes do ano especificado
    const balancetes = await prisma.balanceteData.findMany({
      where: {
        companyId: data.companyId,
        referenceDate: data.year
      }
    })

    if (!balancetes || balancetes.length === 0) {
      throw new NotFoundError('Nenhum balancete encontrado para o ano especificado!')
    }

     // Calcular o total para cada item do balanço
    const balancosWithTotals: BalancoWithTotal[] = await Promise.all(
      balancos.map(async (balanco: any) => {
        // Filtrar balancetes cuja accountingAccount COMEÇA com algum dos códigos do array
        const balancetesFiltrados = balancetes.filter(balancete =>
          balanco.accountingAccounts.some((accountCode: string) =>
            balancete.accountingAccount.startsWith(accountCode)
          )
        )

        // Somar os currentBalance dos balancetes filtrados
        const total = balancetesFiltrados.reduce((sum, balancete) => {
          return sum + Number(balancete.currentBalance)
        }, 0)

        return {
          ...balanco,
          total,
          // Opcional: incluir quantidade de contas encontradas para debug
          contasEncontradas: balancetesFiltrados.length
        }
      })
    )

    return balancosWithTotals
  } catch (error) {
    console.error('Error in listBalancoWithTotals:', error)
    throw error
  }
}

export const listBalancosByCompany = async (companyId: string) => {
  try {
    const balancos = await prisma.balancoTemplate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!balancos || balancos.length === 0) {
      throw new NotFoundError('Nenhum item de balanço encontrado para esta empresa!')
    }

    return balancos
  } catch (error) {
    console.error('Error in listBalancosByCompany:', error)
    throw error
  }
}