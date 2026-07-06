import type { Response } from "express";
import type { TResponse } from "../interface/global.js";

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    statusCode: data?.statusCode,
    message: data?.message,
    meta: data?.meta,
    data: data?.data,
  });
};
