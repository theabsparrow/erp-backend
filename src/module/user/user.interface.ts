import type { Types } from "mongoose";

export type TUserStatus = "active" | "block";

export type TUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Types.ObjectId | null;
  profilePicture?: string;
  status: TUserStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
