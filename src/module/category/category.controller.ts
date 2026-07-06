import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { categoryService } from "./category.service.js";
import type { NextFunction, Request, Response } from "express";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.createCategory(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  },
);

const getCategoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await categoryService.getCategoryById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category fetched successfully",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await categoryService.updateCategory(id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await categoryService.deleteCategory(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
