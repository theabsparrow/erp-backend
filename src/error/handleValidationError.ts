import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import type { TErrorSource, TValidationError } from "../interface/error.js";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TValidationError => {
  const errorSource: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );
  const statusCode = StatusCodes.BAD_REQUEST;
  const message = "validation error";
  return {
    statusCode,
    message,
    errorSource,
  };
};
export default handleValidationError;
