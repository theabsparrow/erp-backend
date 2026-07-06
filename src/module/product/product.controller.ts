import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError.js";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { productService } from "./product.service.js";
import type { NextFunction, Request, Response } from "express";

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
      throw new AppError(StatusCodes.BAD_REQUEST, "Product image is required");
    const payload = { ...req.body, image: req.file.path };
    const result = await productService.createProduct(payload);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  },
);

const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.getAllProducts(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Products fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await productService.getProductById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product fetched successfully",
      data: result,
    });
  },
);

const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = req.file ? { ...req.body, image: req.file.path } : req.body;
    const result = await productService.updateProduct(id, payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  },
);

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await productService.deleteProduct(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  },
);

export const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
