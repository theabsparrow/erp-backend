import mongoose from "mongoose";
import config from "../../config/index.js";
import Role from "./role.model.js";
import { seedRoles } from "./role.const.js";

async function seedRoleData() {
  try {
    await mongoose.connect(config.database_url as string);
    for (const role of seedRoles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create(role);
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
