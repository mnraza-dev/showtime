import express, { Router, Request, Response, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router: Router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

const signupHandler: RequestHandler = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword },
        });

        res.status(201).json({
            message: "Signup successful",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error: any) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

const loginHandler: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "2h" });

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error: any) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

router.post("/signup", signupHandler);
router.post("/login", loginHandler);

export default router;
