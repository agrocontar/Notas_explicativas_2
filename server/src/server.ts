import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());

// Rotas
app.use("/users", userRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
);
