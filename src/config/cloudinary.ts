import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "./index.js";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name!,
  api_key: config.cloudinary_api_key!,
  api_secret: config.cloudinary_api_secret!,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "erp/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  } as object,
});

export const upload = multer({ storage });
export default cloudinary;
