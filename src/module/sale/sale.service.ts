import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError.js";
import Product from "../product/product.model.js";
import type {
  TCreateSalePayload,
  TSaleProductSnapshot,
} from "./sale.interface.js";
import Sale from "./sale.model.js";

const createSale = async (soldBy: string, payload: TCreateSalePayload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const snapshots: TSaleProductSnapshot[] = [];
    let grandTotal = 0;

    for (const item of payload.items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `Product not found: ${item.productId}`,
        );
      }
      if (!product.category) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Product "${product.name}" has no category and cannot be sold`,
        );
      }
      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
        );
      }

      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } },
        { session },
      );

      const subtotal = product.sellingPrice * item.quantity;
      grandTotal += subtotal;

      snapshots.push({
        productId: product._id as mongoose.Types.ObjectId,
        name: product.name,
        sku: product.sku,
        image: product.image,
        sellingPrice: product.sellingPrice,
        quantity: item.quantity,
        subtotal,
      });
    }

    const [sale] = await Sale.create(
      [{ soldBy, items: snapshots, grandTotal }],
      { session },
    );

    await session.commitTransaction();
    return sale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllSales = async () => {
  return await Sale.find().populate("soldBy", "name email");
};

const getSaleById = async (id: string) => {
  const sale = await Sale.findById(id).populate("soldBy", "name email");
  if (!sale) throw new AppError(StatusCodes.NOT_FOUND, "Sale not found");
  return sale;
};

export const saleService = {
  createSale,
  getAllSales,
  getSaleById,
};
