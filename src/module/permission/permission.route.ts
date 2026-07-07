import { Router } from "express";
import { checkPermission } from "../../middlewire/auth.js";
import { permissionController } from "./permission.controller.js";
import { PERMISSIONS } from "./permission.const.js";

const permissionRouter: Router = Router();

permissionRouter.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_ROLE),
  permissionController.getAllPermissions,
);

export default permissionRouter;
