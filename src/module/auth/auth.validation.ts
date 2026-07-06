import { z } from "zod/v3";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const changeOwnPasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const adminChangePasswordSchema = z.object({
  userId: z.string().min(1),
  newPassword: z.string().min(6),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const authValidation = {
  loginSchema,
  changeOwnPasswordSchema,
  adminChangePasswordSchema,
  refreshTokenSchema,
};
