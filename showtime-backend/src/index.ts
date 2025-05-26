import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth.js";
dotenv.config();
const prisma = new PrismaClient();

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
