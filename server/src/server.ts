import express from "express";
import userRoutes from "./routes/userRoutes";
import companyRoutes from "./routes/companyRoutes";
import groupCompaniesRoutes from './routes/groupCompaniesRoutes'
import uploadRoutes from './routes/uploadRoutes'
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: true, // Aceita qualquer origem
  credentials: true, // Permite cookies e autenticação
}));

// Rotas
app.use("/users", userRoutes);
app.use("/companies", companyRoutes);
app.use("/groupCompanies", groupCompaniesRoutes)
app.use("/upload", uploadRoutes)

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
);
