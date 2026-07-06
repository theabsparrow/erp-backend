import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest.js";
import { auth, checkPermission } from "../../middlewire/auth.js";
import { authController } from "./auth.controller.js";
import { authValidation } from "./auth.validation.js";
import { PERMISSIONS, ROLES } from "../permission/permission.const.js";

const authRouter: Router = Router();

authRouter.post("/login", validateRequest(authValidation.loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh-token", authController.refreshAccessToken);

authRouter.patch(
  "/change-password",
  checkPermission(PERMISSIONS.AUTH_CHANGE_PASSWORD),
  validateRequest(authValidation.changeOwnPasswordSchema),
  authController.changeOwnPassword
);

authRouter.patch(
  "/admin/change-password",
  auth(ROLES.ADMIN),
  validateRequest(authValidation.adminChangePasswordSchema),
  authController.adminChangePassword
);

export default authRouter;
