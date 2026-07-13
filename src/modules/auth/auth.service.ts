import bcrypt from "bcryptjs";

import { prisma } from "../../lib/prisma.js";
import config from "../../config/index.js";

import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/jwt.js";

import type { ILoginUser, IRegisterUser } from "./auth.interface.js";

const registerUser = async (payload: IRegisterUser) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcryptSaltRounds
  );

  // Create user
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return newUser;
};

const loginUser = async (payload: ILoginUser) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  // Check user status
  if (user.status === "SUSPENDED") {
    throw new AppError(403, "Your account has been suspended.");
  }

  // Compare password
  const passwordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!passwordMatched) {
    throw new AppError(401, "Invalid email or password.");
  }

  // Generate JWT
  const accessToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn
  );

  return {
    accessToken,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};