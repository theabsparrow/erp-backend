import { z } from "zod/v3";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(6),
  role: z.string().min(1),
  profilePicture: z.string().optional(),
  status: z.enum(["active", "block"]).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  profilePicture: z.string().optional(),
  status: z.enum(["active", "block"]).optional(),
});

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  profilePicture: z.string().optional(),
});

export const userValidation = {
  createUserSchema,
  updateUserSchema,
  updateMeSchema,
};
