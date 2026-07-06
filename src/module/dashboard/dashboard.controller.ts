import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { dashboardService } from "./dashboard.service.js";
import type { NextFunction, Request, Response } from "express";

const getStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await dashboardService.getStats();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: result,
    });
  },
);

export const dashboardController = { getStats };
