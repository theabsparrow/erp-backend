import mongoose from "mongoose";
import config from "../../config/index.js";
import Role from "../role/role.model.js";
import User from "./user.model.js";

async function seedAdminUser() {
  try {
    await mongoose.connect(config.database_url as string);
    const adminRole = await Role.findOne({ name: "Admin" });
    if (!adminRole) {
      console.error("Admin role not found. Run 'pnpm seed:roles' first.");
      process.exit(1);
    }

    const exists = await User.findOne({ email: "admin@erp.com" });
    if (exists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email: "admin@erp.com",
      phone: "01864846666",
      password: "Admin@123",
      role: adminRole._id,
      status: "active",
    });

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdminUser();
