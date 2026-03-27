import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../utils/prisma";
import type { LoginInput, RegisterInput, UserRole } from "../types/auth";

const roleSchema = z.enum(["merchant", "customer"]);

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(32),
  nickname: z.string().min(1).max(20),
  phone: z.string().min(6).max(20)
});

const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(32),
  role: roleSchema
});

function signToken(userId: number, role: UserRole) {
  return jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: "7d" });
}

function toSafeUser(
  user: {
    id: number;
    username: string;
    nickname: string;
    phone: string;
    avatar: string;
  },
  role: UserRole
) {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    phone: user.phone,
    avatar: user.avatar,
    currentRole: role
  };
}

export async function registerUser(input: RegisterInput) {
  const payload = registerSchema.parse(input);

  const existingUser = await prisma.user.findUnique({
    where: { username: payload.username }
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const defaultRole: UserRole = "customer";

  const user = await prisma.user.create({
    data: {
      username: payload.username,
      passwordHash,
      nickname: payload.nickname,
      phone: payload.phone,
      avatar: `https://dummyimage.com/160x160/111827/ffffff&text=${payload.nickname.slice(0, 1)}`
    }
  });

  return {
    token: signToken(user.id, defaultRole),
    user: toSafeUser(user, defaultRole)
  };
}

export async function loginUser(input: LoginInput) {
  const payload = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { username: payload.username }
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const matched = await bcrypt.compare(payload.password, user.passwordHash);

  if (!matched) {
    throw new Error("Invalid username or password");
  }

  return {
    token: signToken(user.id, payload.role),
    user: toSafeUser(user, payload.role)
  };
}

export async function getProfile(userId: number, role: UserRole) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return toSafeUser(user, roleSchema.parse(role));
}
