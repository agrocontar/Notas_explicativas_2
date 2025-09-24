"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Iniciando seed do ConfigTemplate e balanco...");
    // Load json de plano de contas
    const rawData = fs_1.default.readFileSync("prisma/plano_contas_padrao.json", "utf-8");
    const configs = JSON.parse(rawData);
    // Normaliza cada conta
    const normalizeAccountingAccount = (value) => {
        let str = String(value);
        str = str.replace(/\D/g, ""); // remove pontuação
        if (str.length < 10)
            str = str.padEnd(10, "0"); // completa à direita com zeros
        if (str.length > 10)
            str = str.substring(0, 10); // garante máximo 10
        return str;
    };
    // Deleta todas as configTemplate antes de inserir
    await prisma.configTemplate.deleteMany();
    // Insere ConfigTemplate no banco
    await prisma.configTemplate.createMany({
        data: configs.map((row) => ({
            accountingAccount: normalizeAccountingAccount(row.accountingAccount),
            accountName: row.accountName,
        })),
        skipDuplicates: true // evita erro se já rodar de novo
    });
    console.log("✅ Config Template concluído com sucesso!");
    // Load json de balanço
    const balancoData = fs_1.default.readFileSync("prisma/balanco.json", "utf-8");
    const balancoItems = JSON.parse(balancoData);
    // Função para validar e converter o grupo
    const parseBalancoGroup = (group) => {
        switch (group) {
            case "ATIVO_CIRCULANTE":
                return client_1.BalancoGroup.ATIVO_CIRCULANTE;
            case "ATIVO_NAO_CIRCULANTE":
                return client_1.BalancoGroup.ATIVO_NAO_CIRCULANTE;
            case "PASSIVO_CIRCULANTE":
                return client_1.BalancoGroup.PASSIVO_CIRCULANTE;
            case "PASSIVO_NAO_CIRCULANTE":
                return client_1.BalancoGroup.PASSIVO_NAO_CIRCULANTE;
            case "PATRIMONIO_LIQUIDO":
                return client_1.BalancoGroup.PATRIMONIO_LIQUIDO;
            default:
                throw new Error(`Grupo inválido: ${group}`);
        }
    };
    // Normaliza as contas contábeis do balanço
    const normalizeBalancoAccounts = (accounts) => {
        return accounts.map(account => {
            let normalized = account.replace(/\D/g, ""); // remove pontuação
            return normalized;
        });
    };
    // Deleta todas as balancoTemplate antes de inserir
    await prisma.balancoTemplate.deleteMany();
    // Insere BalancoTemplate no banco
    await prisma.balancoTemplate.createMany({
        data: balancoItems.map(item => ({
            name: item.name,
            group: parseBalancoGroup(item.group),
            accountingAccounts: normalizeBalancoAccounts(item.accountingAccounts)
        })),
        skipDuplicates: true
    });
    console.log("✅ Balanço Template concluído com sucesso!");
    const dreData = fs_1.default.readFileSync("prisma/dre.json", "utf-8");
    const dreItems = JSON.parse(dreData);
    // Função para validar e converter o grupo
    const parseDreGroup = (group) => {
        switch (group) {
            case "RECEITAS_LIQUIDAS":
                return client_1.DreGroup.RECEITAS_LIQUIDAS;
            case "CUSTOS":
                return client_1.DreGroup.CUSTOS;
            case "DESPESAS_OPERACIONAIS":
                return client_1.DreGroup.DESPESAS_OPERACIONAIS;
            case "RESULTADO_FINANCEIRO":
                return client_1.DreGroup.RESULTADO_FINANCEIRO;
            case "IMPOSTOS":
                return client_1.DreGroup.IMPOSTOS;
            default:
                throw new Error(`Grupo inválido: ${group}`);
        }
    };
    // Deleta todas as dreTemplate antes de inserir
    await prisma.dreTemplate.deleteMany();
    // Insere DreTemplate no banco
    await prisma.dreTemplate.createMany({
        data: dreItems.map(item => ({
            name: item.name,
            group: parseDreGroup(item.group),
            accountingAccounts: normalizeBalancoAccounts(item.accountingAccounts)
        })),
        skipDuplicates: true
    });
    console.log("✅ DRE Template concluído com sucesso!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
