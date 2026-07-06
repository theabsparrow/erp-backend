import { Router } from "express";
import { userController } from "../module/user/user.controller.js";


const router:Router = Router();

const moduleRoutes = [
  {
    path: "/create-user",
    route: userController.createUser,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
