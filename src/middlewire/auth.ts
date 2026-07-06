/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextFunction, Request, Response } from "express";
import type { TUSerRole } from "../module/user/user.interface.js";
import { catchAsync } from "../utills/catchAsync.js";
import AppError from "../error/AppError.js";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../module/auth/auth.utills.js";
import config from "../config/index.js";
import type { JwtPayload } from "jsonwebtoken";

export const auth = (...requiredRoles: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "you are not authorized");
    }
    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (err: any) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        `you are not authorized ${err}`
      );
    }
    const { userRole } = decoded as JwtPayload;
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "you are not authortized");
    }
    req.user = decoded as JwtPayload;
    next();
  });
};
