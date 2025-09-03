import { PrismaClient } from "@prisma/client"
import fs from "fs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do ConfigTemplate...")

  // Load json of configs
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

  // Insere no banco
  await prisma.configTemplate.createMany({
    data: configs.map((row) => ({
      accountingAccount: normalizeAccountingAccount(row.accountingAccount),
      accountName: row.accountName,
    })),
    skipDuplicates: true // evita erro se já rodar de novo
  })

  console.log("✅ Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
