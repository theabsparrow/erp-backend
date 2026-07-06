import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config/index.js";
import type { TUser } from "./user.interface.js";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    profilePicture: { type: String },
    status: { type: String, enum: ["active", "block"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );
});

userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

userSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const User = model<TUser>("User", userSchema);
export default User;
