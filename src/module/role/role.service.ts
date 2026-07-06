import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError.js";
import type { TRole, TUpdateRolePayload } from "./role.interface.js";
import Role from "./role.model.js";
import { PROTECTED_ROLES } from "./role.const.js";

const createRole = async (payload: TRole) => {
  const exists = await Role.findOne({ name: payload.name });
  if (exists) throw new AppError(StatusCodes.CONFLICT, "Role already exists");
  return await Role.create(payload);
};

const getAllRoles = async () => {
  return await Role.find();
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
  return await Role.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const roleService = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
