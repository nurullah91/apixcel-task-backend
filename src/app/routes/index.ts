import { Router } from "express";
import { AuthRoutes } from "../modules/user/auth.route";
import { UserRoutes } from "../modules/user/user.routes";
import { ProductRoutes } from "../modules/product/product.route";

const router = Router();

const allRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
];

// Consume all routes
allRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
