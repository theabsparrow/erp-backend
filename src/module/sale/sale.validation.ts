import { z } from "zod/v3";

const createSaleSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number({ coerce: true }).int().min(1),
      })
    )
    .min(1, "At least one item is required"),
});

export const saleValidation = {
  createSaleSchema,
};
