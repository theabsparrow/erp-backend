export type TRoleStatus = "active" | "freeze";

export type TRole = {
  name: string;
  description: string;
  status: TRoleStatus;
  permissions: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUpdateRolePayload = {
  name?: string;
  description?: string;
  status?: TRoleStatus;
  addPermissions?: string[];
  removePermissions?: string[];
};
