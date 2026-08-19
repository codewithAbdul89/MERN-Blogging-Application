import express from "express"
import { authorizeRole, protectedRoute } from "../middlewares/auth.middleware.js"
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";
import { createCategoryValidator, updateCategoryValidator } from "../validators/category.validator.js";
import validate from "../middlewares/validate.middleware.js"

const router = express.Router();

router.post(
    "/",
    protectedRoute,
    authorizeRole("ADMIN"),
    createCategoryValidator,
    validate,
    createCategory
);

router.patch(
    '/:categoryId',
    protectedRoute,
    authorizeRole("ADMIN"),
    updateCategoryValidator,
    validate,
    updateCategory
);

router.delete(
    '/:categoryId',
    protectedRoute,
    authorizeRole("ADMIN"),
    deleteCategory
);

router.get(
    '/',
    protectedRoute,
    getAllCategories
)

// router.get(
//     '/:categoryId',
//     protectedRoute,
//     getSingleCategory
// )

const categoryRouter = router;
export default categoryRouter;