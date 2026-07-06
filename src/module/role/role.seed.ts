import mongoose from "mongoose";
import config from "../../config/index.js";
import Role from "./role.model.js";
import type { TRole } from "./role.interface.js";

const seedRoles: TRole[] = [
  {
    name: "Admin",
    description: "Has full access to all permissions",
    status: "active",
    permissions: [
      "create_role",
      "update_role",
      "delete_role",
      "view_role",
      "create_user",
      "view_user",
      "update_user",
      "delete_user",
      "create_product",
      "update_product",
      "view_product",
      "delete_product",
      "create_sale",
      "view_sale",
      "update_sale",
      "delete_sale",
    ],
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

async function seedRoleData() {
  try {
    await mongoose.connect(config.database_url as string);
    for (const role of seedRoles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create(role);
        console.log(`Seeded role: ${role.name}`);
      } else {
        console.log(`Role already exists: ${role.name}`);
      }
    }
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedRoleData();
