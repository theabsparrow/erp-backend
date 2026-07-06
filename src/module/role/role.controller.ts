import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { roleService } from "./role.service.js";
import type { NextFunction, Request, Response } from "express";

const createRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await roleService.createRole(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Role created successfully",
      data: result,
    });
  },
);

const getAllRoles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await roleService.getAllRoles();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Roles fetched successfully",
      data: result,
    });
  },
);

const getRoleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await roleService.getRoleById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Role fetched successfully",
      data: result,
    });
  },
);

const updateRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await roleService.updateRole(id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Role updated successfully",
      data: result,
    });
  },
);

const deleteRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await roleService.deleteRole(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Role deleted successfully",
      data: result,
    });
  },
);

export const roleController = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
