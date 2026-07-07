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
        email: config.admin_email as string,
        phone: config.admin_phone as string,
        password: config.admin_pass as string,
        role: adminRole._id,
        status: "active" as const,
      },
      {
        name: "Manager",
        email: config.manager_email as string,
        phone: config.manager_phone as string,
        password: config.manager_pass as string,
        role: managerRole._id,
        status: "active" as const,
      },
      {
        name: "Employee",
        email: config.employee_email as string,
        phone: config.employee_phone as string,
        password: config.employee_pass as string,
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
