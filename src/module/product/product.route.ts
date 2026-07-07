import { Router } from "express";
import { upload } from "../../config/cloudinary.js";
import validateRequest from "../../middlewire/validateRequest.js";
import { checkPermission } from "../../middlewire/auth.js";
import { PERMISSIONS } from "../permission/permission.const.js";
import { productController } from "./product.controller.js";
import { productValidation } from "./product.validation.js";

const productRouter: Router = Router();

productRouter.post(
  "/",
  checkPermission(PERMISSIONS.CREATE_PRODUCT),
  upload.single("image"),
  validateRequest(productValidation.createProductSchema),
  productController.createProduct
);

productRouter.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_PRODUCT),
  productController.getAllProducts
);

productRouter.get(
  "/:id",
  checkPermission(PERMISSIONS.VIEW_PRODUCT),
  productController.getProductById
);

productRouter.patch(
  "/:id",
  checkPermission(PERMISSIONS.UPDATE_PRODUCT),
  upload.single("image"),
  validateRequest(productValidation.updateProductSchema),
  productController.updateProduct
);

productRouter.delete(
  "/:id",
  checkPermission(PERMISSIONS.DELETE_PRODUCT),
  productController.deleteProduct
);

export default productRouter;
