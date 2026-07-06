import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError.js";
import QueryBuilder from "../../builders/QueryBuilder.js";
import cloudinary from "../../config/cloudinary.js";
import Category from "../category/category.model.js";
import type { TProduct } from "./product.interface.js";
import Product from "./product.model.js";

const PRODUCT_SEARCHABLE_FIELDS = ["name", "sku"];

const createProduct = async (payload: TProduct) => {
  const exists = await Product.findOne({ sku: payload.sku });
  if (exists) throw new AppError(StatusCodes.CONFLICT, "Product with this SKU already exists");

  const category = await Category.findById(payload.category);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");

  return await (await Product.create(payload)).populate("category");
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find().populate("category"), query)
    .search(PRODUCT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginateQuery()
    .fields();

  const data = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { data, meta };
};

const getProductById = async (id: string) => {
  const product = await Product.findById(id).populate("category");
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  return product;
};

const updateProduct = async (id: string, payload: Partial<TProduct>) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

  if (payload.sku && payload.sku !== String(product.sku)) {
    const exists = await Product.findOne({ sku: payload.sku });
    if (exists) throw new AppError(StatusCodes.CONFLICT, "Product with this SKU already exists");
  }

  if (payload.category) {
    const category = await Category.findById(payload.category);
    if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  return await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate("category");
};

const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

  if (product?.image) {
    const publicId = product.image.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId!);
  }

  return await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
