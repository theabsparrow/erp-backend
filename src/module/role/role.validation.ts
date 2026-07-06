import { z } from "zod/v3";

const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["active", "freeze"]).optional(),
  permissions: z.array(z.string()).optional(),
});

const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["active", "freeze"]).optional(),
  addPermissions: z.array(z.string()).optional(),
  removePermissions: z.array(z.string()).optional(),
});

export const roleValidation = {
  createRoleSchema,
  updateRoleSchema,
};
