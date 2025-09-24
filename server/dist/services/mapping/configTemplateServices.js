"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConfigTemplate = void 0;
const prismaClient_1 = require("../../prismaClient");
// List configs template
const listConfigTemplate = async () => {
    const configs = await prismaClient_1.prisma.configTemplate.findMany();
    return configs;
};
exports.listConfigTemplate = listConfigTemplate;
