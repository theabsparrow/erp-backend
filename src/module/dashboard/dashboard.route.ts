import { Router } from "express";
import { auth } from "../../middlewire/auth.js";
import { ROLES } from "../permission/permission.const.js";
import { dashboardController } from "./dashboard.controller.js";

const dashboardRouter:Router = Router();

dashboardRouter.get(
  "/stats",
  auth(),
  dashboardController.getStats
);

export default dashboardRouter;
