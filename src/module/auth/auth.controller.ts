import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utills/catchAsync.js";
import { sendResponse } from "../../utills/sendResponse.js";
import { authService } from "./auth.service.js";
import type { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError.js";
import type { NextFunction, Request, Response } from "express";
import { cookieOptions } from "./auth.utills.js";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = await authService.login(req.body);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: { accessToken },
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token not found");
  const accessToken = await authService.refreshAccessToken(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: { accessToken },
  });
});

const changeOwnPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user as JwtPayload;
  await authService.changeOwnPassword(userId, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

const adminChangePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await authService.adminChangePassword(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User password updated successfully",
    data: null,
  });
});

export const authController = {
  login,
  logout,
  refreshAccessToken,
  changeOwnPassword,
  adminChangePassword,
};
