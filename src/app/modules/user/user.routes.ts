import express from "express";
import { UserController } from "./user.controller";
import { multerUpload } from "../../config/multer.config";
import checkAuth from "../../middlewares/checkAuth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.delete(
  "/:userId",
  checkAuth(USER_ROLE.admin),
  UserController.deleteUser
);
router.get("/:userId", UserController.getSingleUser);

router.patch(
  "/update-profile/:userId",
  checkAuth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.single("image"),
  UserController.updateProfile
);
router.patch(
  "/update-cover/:userId",
  checkAuth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.single("image"),
  UserController.updateCover
);

export const UserRoutes = router;
