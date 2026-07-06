import { model, Schema } from "mongoose";
import type { TRole } from "./role.interface.js";

const roleSchema = new Schema<TRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["active", "freeze"], default: "active" },
    permissions: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

roleSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

roleSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const Role = model<TRole>("Role", roleSchema);
export default Role;
