import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError.js";
import config from "../../config/index.js";
import User from "../user/user.model.js";
import type { TRole } from "../role/role.interface.js";
import type {
  TAdminChangePassword,
  TChangeOwnPassword,
  TLoginPayload,
  TTokenPayload,
} from "./auth.interface.js";
import { createToken, verifyToken } from "./auth.utills.js";

const login = async (payload: TLoginPayload) => {
  const user = await User.findOne({ email: payload.email }).populate<{ role: TRole }>("role");
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  if (!user.role) throw new AppError(StatusCodes.FORBIDDEN, "User has no assigned role");
  if (user.status === "block") throw new AppError(StatusCodes.FORBIDDEN, "User is blocked");
  if (user.role.status === "freeze") throw new AppError(StatusCodes.FORBIDDEN, "User role is not active");

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

  const tokenPayload: TTokenPayload = {
    userId: String(user._id),
    roleName: user.role.name,
    permissions: user.role.permissions,
  };

  const accessToken = createToken(tokenPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
  const refreshToken = createToken(tokenPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);

  return { accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken: string) => {
  let decoded: JwtPayload;
  try {
    decoded = verifyToken(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId).populate<{ role: TRole }>("role");
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  if (user.status === "block") throw new AppError(StatusCodes.FORBIDDEN, "User is blocked");
  if (!user.role) throw new AppError(StatusCodes.FORBIDDEN, "User has no assigned role");
  if (user.role.status === "freeze") throw new AppError(StatusCodes.FORBIDDEN, "User role is not active");

  const tokenPayload: TTokenPayload = {
    userId: String(user._id),
    roleName: user.role.name,
    permissions: user.role.permissions,
  };

  return createToken(tokenPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
};

const changeOwnPassword = async (userId: string, payload: TChangeOwnPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) throw new AppError(StatusCodes.UNAUTHORIZED, "Old password is incorrect");

  user.password = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
  await user.save({ validateBeforeSave: false });
};

const adminChangePassword = async (payload: TAdminChangePassword) => {
  const user = await User.findById(payload.userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  user.password = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
  await user.save({ validateBeforeSave: false });
};

export const authService = {
  login,
  refreshAccessToken,
  changeOwnPassword,
  adminChangePassword,
};
