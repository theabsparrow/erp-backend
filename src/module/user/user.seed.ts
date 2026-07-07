import mongoose from "mongoose";
import config from "../../config/index.js";
import Role from "../role/role.model.js";
import User from "./user.model.js";

async function seedAdminUser() {
  try {
    await mongoose.connect(config.database_url as string);
    const adminRole = await Role.findOne({ name: "Admin" });
    const managerRole = await Role.findOne({ name: "Manager" });
    const employeeRole = await Role.findOne({ name: "Employee" });
    if (!adminRole || !managerRole || !employeeRole) {
      console.error(
        "Admin, manager and employee role not found. Run 'pnpm seed:roles' first.",
      );
      process.exit(1);
    }

    const exists = await User.findOne({ email: "admin@erp.com" });
    if (exists) {
      process.exit(0);
    }

    const userSeed = [
      {
        name: "Admin",
        email: "admin@erp.com",
        phone: "01864846666",
        password: "Admin@123",
        role: adminRole._id,
        status: "active" as const,
      },
      {
        name: "Manager",
        email: "manager@gmail.com",
        phone: "01845477161",
        password: "Manager@123",
        role: managerRole._id,
        status: "active" as const,
      },
      {
        name: "Employee",
        email: "employee@gmail.com",
        phone: "01949117485",
        password: "Employee@123",
        role: employeeRole._id,
        status: "active" as const,
      },
    ];

    for (const user of userSeed) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
      } else {
        console.log(`Role already exists: ${user.name}`);
      }
    }

    await User.create();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdminUser();
