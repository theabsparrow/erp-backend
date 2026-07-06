import { z } from "zod/v3";

const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
