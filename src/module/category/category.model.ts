import { model, Schema } from "mongoose";
import type { TCategory } from "./category.interface.js";

const categorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

categorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

categorySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const Category = model<TCategory>("Category", categorySchema);
export default Category;
