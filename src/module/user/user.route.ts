import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest.js";
import { auth, checkPermission } from "../../middlewire/auth.js";
import { userController } from "./user.controller.js";
import { userValidation } from "./user.validation.js";
import { PERMISSIONS, ROLES } from "../permission/permission.const.js";
import { upload } from "../../config/cloudinary.js";
import { parseToJsonFormat } from "../../middlewire/parseToJsonFormat.js";

const userRouter: Router = Router();

userRouter.get(
  "/me",
  auth(ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE),
  userController.getMe,
);
userRouter.patch(
  "/me",
  auth(ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE),
  upload.single("profilePicture"),
  parseToJsonFormat,
  validateRequest(userValidation.updateMeSchema),
  userController.updateMe,
);
userRouter.post(
  "/",
  checkPermission(PERMISSIONS.CREATE_USER),
  validateRequest(userValidation.createUserSchema),
  userController.createUser,
);
userRouter.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_USER),
  userController.getAllUsers,
);
userRouter.get(
  "/:id",
  checkPermission(PERMISSIONS.VIEW_USER),
  userController.getUserById,
);
userRouter.patch(
  "/:id",
  checkPermission(PERMISSIONS.UPDATE_USER),
  upload.single("profilePicture"),
  parseToJsonFormat,
  validateRequest(userValidation.updateUserSchema),
  userController.updateUser,
);
userRouter.delete(
  "/:id",
  checkPermission(PERMISSIONS.DELETE_USER),
  userController.deleteUser,
);

export default userRouter;
