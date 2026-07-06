import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest.js";
import { checkPermission } from "../../middlewire/auth.js";
import { roleController } from "./role.controller.js";
import { roleValidation } from "./role.validation.js";
import { PERMISSIONS } from "../permission/permission.const.js";

const roleRouter: Router = Router();

roleRouter.post(
  "/",
  checkPermission(PERMISSIONS.CREATE_ROLE),
  validateRequest(roleValidation.createRoleSchema),
  roleController.createRole,
);
roleRouter.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_ROLE),
  roleController.getAllRoles,
);
roleRouter.get(
  "/:id",
  checkPermission(PERMISSIONS.VIEW_ROLE),
  roleController.getRoleById,
);
roleRouter.patch(
  "/:id",
  checkPermission(PERMISSIONS.UPDATE_ROLE),
  validateRequest(roleValidation.updateRoleSchema),
  roleController.updateRole,
);
roleRouter.delete(
  "/:id",
  checkPermission(PERMISSIONS.DELETE_ROLE),
  roleController.deleteRole,
);

export default roleRouter;
