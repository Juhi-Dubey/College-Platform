import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import prisma from '../config/db';

const signupSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
   password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain 1 uppercase letter")
    .regex(/[0-9]/, "Must contain 1 number"),
});


const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  password: z.string().min(1, "Password is required"),
});


const getJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return process.env.JWT_SECRET;
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = signupSchema.parse({
      email: req.body.email?.trim(),
      password: req.body.password,
    });

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, getJWTSecret(), { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues.map(e => e.message) });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



export const login = async (req: Request, res: Response) => {
  try {

    const { email, password } = loginSchema.parse({
      email: req.body.email?.trim(),
      password: req.body.password,
    });
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, getJWTSecret(), { expiresIn: '7d' });
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues.map(e => e.message) });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
