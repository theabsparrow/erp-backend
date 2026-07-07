import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { userService } from "./user.service.js";
import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createUser(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User created successfully",
      data: result,
    });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Users fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await userService.getUserById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = req.file ? { ...req.body, profilePicture: req.file.path } : req.body;

    const result = await userService.updateUser(id, payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await userService.deleteUser(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  },
);

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const result = await userService.getMe(userId);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Profile fetched successfully", data: result });
});

const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  const payload = req.file ? { ...req.body, profilePicture: req.file.path } : req.body;
  const result = await userService.updateMe(userId, payload);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Profile updated successfully", data: result });
});

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  getMe,
  updateMe,
  updateUser,
  deleteUser,
};
