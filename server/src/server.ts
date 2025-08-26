import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

app.post("/users", async (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const user = await prisma.user.create({ data });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
);
