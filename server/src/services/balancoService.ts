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
  companyId: string
}


export const createBalanco = async (data: CreateBalancoData) => {
  try {
    // Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: {
        id: data.companyId
      }
    })

    if (!company) {
      throw new NotFoundError('Empresa não encontrada!')
    }

    // Verificar se já existe um balanço com o mesmo nome para esta empresa
    const existingBalanco = await prisma.balanco.findFirst({
      where: {
        companyId: data.companyId,
        name: data.name
      }
    })

    if (existingBalanco) {
      throw new Error('Já existe um balanço com este nome para esta empresa!')
    }

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
    const balanco = await prisma.balanco.create({
      data: {
        name: data.name,
        group: data.group as any, // Cast para o enum do Prisma
        accountingAccounts: data.accountingAccounts,
        companyId: data.companyId
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
    const balancos = await prisma.balanco.findMany({
      where: {
        companyId: data.companyId
      },
      orderBy: {
        group: 'asc'
      }
    })

    if (!balancos || balancos.length === 0) {
      throw new NotFoundError('Nenhum item de balanço encontrado para esta empresa!')
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
        // Filtrar balancetes que possuem accountingAccount no array do balanço
        const balancetesFiltrados = balancetes.filter(balancete =>
          balanco.accountingAccounts.includes(balancete.accountingAccount)
        )

        // Somar os currentBalance dos balancetes filtrados
        const total = balancetesFiltrados.reduce((sum, balancete) => {
          return sum + Number(balancete.currentBalance)
        }, 0)

        return {
          ...balanco,
          total
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
    const balancos = await prisma.balanco.findMany({
      where: {
        companyId,
      },
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