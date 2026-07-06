import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utills/catchAsync.js";
import AppError from "../error/AppError.js";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../module/auth/auth.utills.js";
import config from "../config/index.js";
import type { JwtPayload } from "jsonwebtoken";
import type { TPermissionKey, TRoleName } from "../module/permission/permission.const.js";

const decodeToken = (req: Request): JwtPayload => {
  const token = req.headers.authorization;
  if (!token) throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  try {
    return verifyToken(token, config.jwt_access_secret as string) as JwtPayload;
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }
};

export const auth = (...requiredRoles: TRoleName[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const decoded = decodeToken(req);
    if (requiredRoles.length && !requiredRoles.includes(decoded.roleName)) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission");
    }
    req.user = decoded;
    next();
  });
};

export const checkPermission = (...requiredPermissions: TPermissionKey[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const decoded = decodeToken(req);
    const userPermissions: string[] = decoded.permissions ?? [];
    const hasPermission = requiredPermissions.every((p) => userPermissions.includes(p));
    if (!hasPermission) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission");
    }
    req.user = decoded;
    next();
  });
};
