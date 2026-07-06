import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest.js";
import { checkPermission } from "../../middlewire/auth.js";
import { PERMISSIONS } from "../permission/permission.const.js";
import { saleController } from "./sale.controller.js";
import { saleValidation } from "./sale.validation.js";

const saleRouter:Router = Router();

saleRouter.post(
  "/",
  checkPermission(PERMISSIONS.CREATE_SALE),
  validateRequest(saleValidation.createSaleSchema),
  saleController.createSale
);

saleRouter.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_SALE),
  saleController.getAllSales
);

saleRouter.get(
  "/:id",
  checkPermission(PERMISSIONS.VIEW_SALE),
  saleController.getSaleById
);

export default saleRouter;
