import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest.js";
import { checkPermission } from "../../middlewire/auth.js";
import { PERMISSIONS } from "../permission/permission.const.js";
import { categoryController } from "./category.controller.js";
import { categoryValidation } from "./category.validation.js";

const categoryRouter:Router = Router();

categoryRouter.post(
  "/",
  checkPermission(PERMISSIONS.CREATE_PRODUCT),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);
categoryRouter.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_CATEGORY),
  categoryController.getAllCategories,
);
categoryRouter.get(
  "/:id",
  checkPermission(PERMISSIONS.VIEW_CATEGORY),
  categoryController.getCategoryById,
);
categoryRouter.patch(
  "/:id",
  checkPermission(PERMISSIONS.UPDATE_CATEGORY),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);
categoryRouter.delete(
  "/:id",
  checkPermission(PERMISSIONS.DELETE_CATEGORY),
  categoryController.deleteCategory,
);

export default categoryRouter;
