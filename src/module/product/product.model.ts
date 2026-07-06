import { model, Schema } from "mongoose";
import type { TProduct } from "./product.interface.js";

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const Product = model<TProduct>("Product", productSchema);
export default Product;
