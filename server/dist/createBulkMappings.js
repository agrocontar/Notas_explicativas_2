"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// createBulkMappingsScript.ts
const configMappingServices_1 = require("./services/mapping/configMappingServices");
// Seus mapeamentos em formato de array
const mappingsData = [
    { companyAccount: "1121130000", defaultAccount: "1121040000" },
    { companyAccount: "1121130001", defaultAccount: "1121040001" },
    { companyAccount: "1131060050", defaultAccount: "1131060001" },
    { companyAccount: "1171060000", defaultAccount: "1171050000" },
    { companyAccount: "1171060001", defaultAccount: "1171050001" },
    { companyAccount: "1171060002", defaultAccount: "1171050002" },
    { companyAccount: "1233030050", defaultAccount: "1233030001" },
    { companyAccount: "1242010020", defaultAccount: "1242010002" },
    { companyAccount: "2111020033", defaultAccount: "2111020004" },
    { companyAccount: "2111020050", defaultAccount: "2111020005" },
    { companyAccount: "2111030008", defaultAccount: "2111030005" },
    { companyAccount: "2111060050", defaultAccount: "2111060013" },
    { companyAccount: "2311050003", defaultAccount: "2311040009" },
    { companyAccount: "3111080000", defaultAccount: "3171010000" },
    { companyAccount: "3111080001", defaultAccount: "3171010001" },
    { companyAccount: "3112000000", defaultAccount: "3171000000" },
    { companyAccount: "3112010000", defaultAccount: "3171010000" },
    { companyAccount: "3112010003", defaultAccount: "3121010003" },
    { companyAccount: "3112010004", defaultAccount: "3121010004" },
    { companyAccount: "3112010005", defaultAccount: "3121010005" },
    { companyAccount: "3112020000", defaultAccount: "3121020000" },
    { companyAccount: "3112020002", defaultAccount: "3121020002" },
    { companyAccount: "3112020003", defaultAccount: "3121020003" },
    { companyAccount: "3112020051", defaultAccount: "3121020005" },
    { companyAccount: "3112020052", defaultAccount: "3121020006" },
    { companyAccount: "3112030000", defaultAccount: "3121030000" },
    { companyAccount: "3112030002", defaultAccount: "3121030002" },
    { companyAccount: "3112030003", defaultAccount: "3121030003" },
    { companyAccount: "3112030051", defaultAccount: "3121030005" },
    { companyAccount: "3112030052", defaultAccount: "3121030006" },
    { companyAccount: "3112040000", defaultAccount: "3121040000" },
    { companyAccount: "3112040002", defaultAccount: "3121040002" },
    { companyAccount: "3112040003", defaultAccount: "3121040003" },
    { companyAccount: "3112050000", defaultAccount: "3123010000" },
    { companyAccount: "3112050001", defaultAccount: "3123010001" },
    { companyAccount: "3112050002", defaultAccount: "3123010002" },
    { companyAccount: "3112050003", defaultAccount: "3123010003" },
    { companyAccount: "4111010050", defaultAccount: "4111010099" },
    { companyAccount: "4111020050", defaultAccount: "4111020099" },
    { companyAccount: "4111020051", defaultAccount: "4111020027" },
    { companyAccount: "4111030050", defaultAccount: "4111030099" },
    { companyAccount: "4111040050", defaultAccount: "4111040099" },
    { companyAccount: "4111070001", defaultAccount: "4171010001" },
    { companyAccount: "9111060051", defaultAccount: "9111060015" },
    { companyAccount: "4312020052", defaultAccount: "4312020005" },
    { companyAccount: "4312010050", defaultAccount: "4312010001" },
    { companyAccount: "4331080050", defaultAccount: "4331020003" },
    { companyAccount: "4331080051", defaultAccount: "4331020004" },
    { companyAccount: "4211130052", defaultAccount: "4211130005" },
    { companyAccount: "4211130051", defaultAccount: "4211130009" },
    { companyAccount: "4211120051", defaultAccount: "4211120050" },
    { companyAccount: "4211090051", defaultAccount: "4211090050" },
    { companyAccount: "4211080051", defaultAccount: "4211080050" },
    { companyAccount: "4211180015", defaultAccount: "4211180050" },
    { companyAccount: "4211050051", defaultAccount: "4211050050" },
    { companyAccount: "4211030052", defaultAccount: "4211030050" },
    { companyAccount: "4211030051", defaultAccount: "4211030050" },
    { companyAccount: "4211010051", defaultAccount: "4211010050" },
    { companyAccount: "2111010050", defaultAccount: "2111010008" }
];
async function executeBulkMappings(companyId) {
    try {
        console.log(`Iniciando mapeamentos em massa para empresa ${companyId}...`);
        const result = await (0, configMappingServices_1.createBulkMappings)({
            companyId: companyId,
            mappings: mappingsData
        });
        console.log('Resumo:');
        console.log(`- Total de mapeamentos: ${mappingsData.length}`);
        console.log(`- Sucesso: ${result.success.length}`);
        console.log(`- Erros: ${result.errors.length}`);
        console.log(`- Pulados: ${result.skipped.length}`);
        if (result.errors.length > 0) {
            console.log('\nErros detalhados:');
            result.errors.forEach(error => {
                console.log(`- ${error.companyAccount} -> ${error.defaultAccount}: ${error.error}`);
            });
        }
        if (result.skipped.length > 0) {
            console.log('\nMapeamentos pulados:');
            result.skipped.forEach(skipped => {
                console.log(`- ${skipped.companyAccount} -> ${skipped.defaultAccount}: ${skipped.message}`);
            });
        }
    }
    catch (error) {
        console.error('Erro ao executar mapeamentos em massa:', error);
    }
}
// Para executar: substitua 'sua-company-id-aqui' pelo ID real da empresa
executeBulkMappings('077b3c6a-9340-45ad-a230-8f24737a68bc');
