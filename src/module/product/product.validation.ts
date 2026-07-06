import { z } from "zod/v3";

const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  category: z.string().min(1),
  purchasePrice: z.number({ coerce: true }).min(0),
  sellingPrice: z.number({ coerce: true }).min(0),
  stockQuantity: z.number({ coerce: true }).min(0),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  purchasePrice: z.number({ coerce: true }).min(0).optional(),
  sellingPrice: z.number({ coerce: true }).min(0).optional(),
  stockQuantity: z.number({ coerce: true }).min(0).optional(),
});

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};
