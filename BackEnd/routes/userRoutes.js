import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6)
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = signupSchema.parse(req.body);

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (exists)
      return res.status(400).json({ error: "Email or username already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, passwordHash },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = signinSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;