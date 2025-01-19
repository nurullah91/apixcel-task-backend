import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import checkAuth from "../../middlewares/checkAuth";
import { USER_ROLE } from "../user/user.constant";
import { parseBody } from "../../middlewares/parseBody";
import { productSchema } from "./product.validation";
import { ProductController } from "./product.controller";

const router = express.Router();

router.post(
  "/create-product",
  checkAuth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.array("image"),
  parseBody,
  validateRequest(productSchema.updateProductSchema),
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

router.get("/:productId", ProductController.getSingleProduct);

router.delete(
  "/:productId",
  checkAuth(USER_ROLE.user, USER_ROLE.admin),
  ProductController.deleteSingleProduct
);

router.patch(
  "/update-product/:productId",
  checkAuth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.array("image"),
  parseBody,
  ProductController.updateProduct
);

export const ProductRoutes = router;
