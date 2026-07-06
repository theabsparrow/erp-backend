import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../error/AppError.js";
import Product from "../product/product.model.js";
import type { TCategory } from "./category.interface.js";
import Category from "./category.model.js";

const createCategory = async (payload: TCategory) => {
  const exists = await Category.findOne({ name: payload.name });
  if (exists) throw new AppError(StatusCodes.CONFLICT, "Category already exists");
  return await Category.create(payload);
};

const getAllCategories = async () => {
  return await Category.find();
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  return category;
};

const updateCategory = async (id: string, payload: Partial<TCategory>) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  return await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Product.updateMany({ category: id }, { $set: { category: null } }, { session });
    const result = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
