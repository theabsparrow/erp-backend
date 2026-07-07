import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../error/AppError.js";
import type { TRole, TUpdateRolePayload } from "./role.interface.js";
import Role from "./role.model.js";
import { PROTECTED_ROLES } from "./role.const.js";
import User from "../user/user.model.js";
import permissionsData from "../permission/permission.json" with { type: "json" };

const createRole = async (payload: TRole) => {
  const exists = await Role.findOne({ name: payload.name });
  if (exists && !exists.isDeleted) throw new AppError(StatusCodes.CONFLICT, "Role already exists");
  const result =  await Role.create(payload);
  return result
};

const getAllRoles = async () => {
  const roles = await Role.find();
  return { roles, permissions: permissionsData };
};

const getRoleById = async (id: string) => {
  const role = await Role.findById(id);
  if (!role) throw new AppError(StatusCodes.NOT_FOUND, "Role not found");
  return role;
};

const updateRole = async (id: string, payload: TUpdateRolePayload) => {
  const role = await Role.findById(id);
  if (!role) throw new AppError(StatusCodes.NOT_FOUND, "Role not found");
  if (PROTECTED_ROLES.includes(role.name as (typeof PROTECTED_ROLES)[number])) {
    throw new AppError(StatusCodes.FORBIDDEN, "This role cannot be updated");
  }

  const { addPermissions, removePermissions, ...primitiveFields } = payload;

  const updateQuery: Record<string, unknown> = {};

  if (Object.keys(primitiveFields).length) {
    updateQuery["$set"] = primitiveFields;
  }
  if (addPermissions?.length) {
    updateQuery["$addToSet"] = { permissions: { $each: addPermissions } };
  }
  if (removePermissions?.length) {
    updateQuery["$pull"] = { permissions: { $in: removePermissions } };
  }

  return await Role.findByIdAndUpdate(id, updateQuery, {
    new: true,
    runValidators: true,
  });
};

const deleteRole = async (id: string) => {
  const role = await Role.findById(id);
  if (!role) throw new AppError(StatusCodes.NOT_FOUND, "Role not found");
  if (PROTECTED_ROLES.includes(role.name as (typeof PROTECTED_ROLES)[number])) {
    throw new AppError(StatusCodes.FORBIDDEN, "This role cannot be deleted");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await User.updateMany({ role: id }, { $set: { role: null } }, { session });
    const result = await Role.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const roleService = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
