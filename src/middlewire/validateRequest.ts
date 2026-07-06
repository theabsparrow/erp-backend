
import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod/v3";
import { catchAsync } from "../utills/catchAsync.js";

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...req.cookies,
    };
    await schema.parseAsync(data);
    next();
  });
};
export default validateRequest;
