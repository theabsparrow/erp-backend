import { model, Schema } from "mongoose";
import type { TSale, TSaleProductSnapshot } from "./sale.interface.js";

const saleProductSnapshotSchema = new Schema<TSaleProductSnapshot>(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    image: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new Schema<TSale>(
  {
    soldBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [saleProductSnapshotSchema], required: true },
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

const Sale = model<TSale>("Sale", saleSchema);
export default Sale;
