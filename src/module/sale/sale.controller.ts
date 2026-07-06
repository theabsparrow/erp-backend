import { StatusCodes } from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { saleService } from "./sale.service.js";
import type { NextFunction, Request, Response } from "express";

const createSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const result = await saleService.createSale(userId, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Sale created successfully",
      data: result,
    });
  },
);

const getAllSales = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await saleService.getAllSales();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Sales fetched successfully",
      data: result,
    });
  },
);

const getSaleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await saleService.getSaleById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Sale fetched successfully",
      data: result,
    });
  },
);

export const saleController = {
  createSale,
  getAllSales,
  getSaleById,
};
