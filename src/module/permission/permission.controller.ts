import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import type { NextFunction, Request, Response } from "express";
import permissions from "./permission.json" with { type: "json" };

const getAllPermissions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Permissions fetched successfully",
      data: permissions,
    });
  },
);

export const permissionController = { getAllPermissions };
