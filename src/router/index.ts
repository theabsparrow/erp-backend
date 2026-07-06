import { Router } from "express";
import roleRouter from "../module/role/role.route.js";
import userRouter from "../module/user/user.route.js";
import authRouter from "../module/auth/auth.route.js";

const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/roles",
    route: roleRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
