import express from "express";
import {
  authorizeRole,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  popularCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  authorizeRole("ADMIN"),
  createCategoryValidator,
  validate,
  createCategory,
);

router.patch(
  "/:categoryId",
  protectedRoute,
  authorizeRole("ADMIN"),
  updateCategoryValidator,
  validate,
  updateCategory,
);

router.delete(
  "/:categoryId",
  protectedRoute,
  authorizeRole("ADMIN"),
  deleteCategory,
);

router.get("/", getAllCategories);

router.get("/popular-categories", popularCategories);

const categoryRouter = router;
export default categoryRouter;
