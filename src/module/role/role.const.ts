import { PERMISSIONS } from "../permission/permission.const.js";
import type { TRole } from "./role.interface.js";

export const PROTECTED_ROLES = ["Admin"] as const;
export const seedRoles: TRole[] = [
  {
    name: "Admin",
    description: "Has full access to all permissions",
    status: "active",
    permissions: Object.values(PERMISSIONS),
    isDeleted: false,
  },
  {
    name: "Manager",
    description: "Has access to product permissions",
    status: "active",
    permissions: [
      "create_product",
      "update_product",
      "view_product",
      "delete_product",
    ],
    isDeleted: false,
  },
  {
    name: "Employee",
    description: "Has access to view products and sales permissions",
    status: "active",
    permissions: [
      "view_product",
      "create_sale",
      "view_sale",
      "update_sale",
      "delete_sale",
    ],
    isDeleted: false,
  },
];
