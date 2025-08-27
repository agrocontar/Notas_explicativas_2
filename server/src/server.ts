import express from "express";
import userRoutes from "./routes/userRoutes";
import companyRoutes from "./routes/companyRoutes";
import groupCompaniesRoutes from './routes/groupCompaniesRoutes'
import uploadRoutes from './routes/uploadRoutes'
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use("/users", userRoutes);
app.use("/companies", companyRoutes);
app.use("/groupCompanies", groupCompaniesRoutes)
app.use("/upload", uploadRoutes)

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
);
