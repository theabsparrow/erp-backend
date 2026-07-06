import { ZodError, type ZodIssue, } from "zod";

import { StatusCodes } from "http-status-codes";
import type { TErrorSource, TValidationError } from "../interface/error.js";

const handleZodError = (err: ZodError): TValidationError => {
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1] as string,
      message: issue?.message,
    };
  });

  const statusCode = StatusCodes.BAD_REQUEST;
  const message = "validation error";

  return {
    statusCode,
    message,
    errorSource,
  };
};

export default handleZodError;
