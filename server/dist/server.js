"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const groupCompaniesRoutes_1 = __importDefault(require("./routes/groupCompaniesRoutes"));
const balanceteRoutes_1 = __importDefault(require("./routes/balanceteRoutes"));
const balancoRoutes_1 = __importDefault(require("./routes/balancoRoutes"));
const configCompanyRoutes_1 = __importDefault(require("./routes/mapping/configCompanyRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dreRoutes_1 = __importDefault(require("./routes/dreRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Permite todas as origens em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        // Em produção, restringe às origens permitidas
        const allowedOrigins = [
            'http://localhost:3000',
            'http://192.168.62.50:3004',
            'https://seu-dominio.com'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie']
}));
// Rotas
app.use("/users", userRoutes_1.default);
app.use("/companies", companyRoutes_1.default);
app.use("/groupCompanies", groupCompaniesRoutes_1.default);
app.use("/balancete", balanceteRoutes_1.default);
app.use("/balanco", balancoRoutes_1.default);
app.use("/dre", dreRoutes_1.default);
app.use("/config", configCompanyRoutes_1.default);
app.use("/auth", authRoutes_1.default);
// Converter PORT para número explicitamente
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running at http://"0.0.0.0":${process.env.PORT || 3000}`));
