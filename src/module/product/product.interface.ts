import type { Types } from "mongoose";

export type TProduct = {
  name: string;
  sku: string;
  category: Types.ObjectId | null;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
