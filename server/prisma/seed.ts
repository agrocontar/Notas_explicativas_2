import { BalancoGroup, PrismaClient } from "@prisma/client"
import fs from "fs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do ConfigTemplate e balanco...")

  // Load json de plano de contas
  const rawData = fs.readFileSync("prisma/plano_contas_padrao.json", "utf-8")
  const configs: { accountingAccount: string | number, accountName: string }[] = JSON.parse(rawData)

  // Normaliza cada conta
  const normalizeAccountingAccount = (value: string | number): string => {
    let str = String(value)
    str = str.replace(/\D/g, "") // remove pontuação
    if (str.length < 10) str = str.padEnd(10, "0") // completa à direita com zeros
    if (str.length > 10) str = str.substring(0, 10) // garante máximo 10
    return str
  }

  // Insere ConfigTemplate no banco
  await prisma.configTemplate.createMany({
    data: configs.map((row) => ({
      accountingAccount: normalizeAccountingAccount(row.accountingAccount),
      accountName: row.accountName,
    })),
    skipDuplicates: true // evita erro se já rodar de novo
  })

  console.log("✅ Config Template concluído com sucesso!")

  // Load json de balanço
  const balancoData = fs.readFileSync("prisma/balanco.json", "utf-8")
  const balancoItems: { 
    name: string, 
    group: string, 
    accountingAccounts: string[] 
  }[] = JSON.parse(balancoData)

  // Função para validar e converter o grupo
  const parseBalancoGroup = (group: string): BalancoGroup => {
    switch (group) {
      case "ATIVO_CIRCULANTE":
        return BalancoGroup.ATIVO_CIRCULANTE
      case "ATIVO_NAO_CIRCULANTE":
        return BalancoGroup.ATIVO_NAO_CIRCULANTE
      case "PASSIVO_CIRCULANTE":
        return BalancoGroup.PASSIVO_CIRCULANTE
      case "PASSIVO_NAO_CIRCULANTE":
        return BalancoGroup.PASSIVO_NAO_CIRCULANTE
      case "PATRIMONIO_LIQUIDO":
        return BalancoGroup.PATRIMONIO_LIQUIDO
      default:
        throw new Error(`Grupo inválido: ${group}`)
    }
  }

  // Normaliza as contas contábeis do balanço
  const normalizeBalancoAccounts = (accounts: string[]): string[] => {
    return accounts.map(account => {
      let normalized = account.replace(/\D/g, "") // remove pontuação
      return normalized
    })
  }

  // Insere BalancoTemplate no banco
  await prisma.balancoTemplate.createMany({
    data: balancoItems.map(item => ({
      name: item.name,
      group: parseBalancoGroup(item.group),
      accountingAccounts: normalizeBalancoAccounts(item.accountingAccounts)
    })),
    skipDuplicates: true
  })

  console.log("✅ Balanço Template concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })