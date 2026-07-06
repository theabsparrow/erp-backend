import type { Types } from "mongoose";

export type TSaleProductSnapshot = {
  productId: Types.ObjectId;
  name: string;
  sku: string;
  image: string;
  sellingPrice: number;
  quantity: number;
  subtotal: number;
};

export type TSale = {
  soldBy: Types.ObjectId;
  items: TSaleProductSnapshot[];
  grandTotal: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TSaleItemInput = {
  productId: string;
  quantity: number;
};

export type TCreateSalePayload = {
  items: TSaleItemInput[];
};
