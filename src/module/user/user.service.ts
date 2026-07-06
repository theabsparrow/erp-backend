import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError.js";
import type { TUser } from "./user.interface.js";
import User from "./user.model.js";
import { PROTECTED_USERS } from "./user.const.js";
import QueryBuilder from "../../builders/QueryBuilder.js";

const USER_SEARCHABLE_FIELDS = ["name", "email", "phone"];

const createUser = async (payload: TUser) => {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new AppError(StatusCodes.CONFLICT, "User already exists");
  return await User.create(payload);
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find().populate("role"), query)
    .search(USER_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginateQuery()
    .fields();

  const data = await userQuery.modelQuery.select("-password");
  const meta = await userQuery.countTotal();
  return { data, meta };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id).populate("role").select("-password");
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

const getMe = async (id: string) => {
  const user = await User.findById(id).populate("role").select("-password");
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

const updateMe = async (id: string, payload: Partial<Pick<TUser, "name" | "phone" | "profilePicture">>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  return await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate("role").select("-password");
};

const updateUser = async (id: string, payload: Partial<Omit<TUser, "password">>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  if (PROTECTED_USERS.includes(user.email as (typeof PROTECTED_USERS)[number])) {
    throw new AppError(StatusCodes.FORBIDDEN, "Admin user cannot be updated");
  }
  return await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate("role");
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  if (PROTECTED_USERS.includes(user.email as (typeof PROTECTED_USERS)[number])) {
    throw new AppError(StatusCodes.FORBIDDEN, "Admin user cannot be deleted");
  }
  return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  getMe,
  updateMe,
  updateUser,
  deleteUser,
};
