import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/category.model.js";
import { slugify } from "../utils/slugify.js"
import Blog from "../models/blog.model.js"
 

export const createCategory = asyncHandler(async (req, res) => {

    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
        throw new ApiError(
            400,
            "Category already exists."
        );
    }

    const slug = slugify(name);

    const createdCategory = await Category.create({
        name,
        slug,
        description
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Category created successfully.",
            {
                category: createdCategory
            }
        )
    );

});

export const updateCategory = asyncHandler(async (req, res) => {

    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    const updatedData = {};

    if (name) {

        const existingCategory = await Category.findOne({
            name,
            _id: { $ne: categoryId } //whose id is not equal to parms id because we update that's one so dont pick that and give if has other whose name is matched
        });

        if (existingCategory) {
            throw new ApiError(400, "Category already exists.");
        }

        updatedData.name = name;
        updatedData.slug = slugify(name);
    }

    if (description) {
        updatedData.description = description;
    }

    if (Object.keys(updatedData).length === 0) {
        throw new ApiError(
            400,
            "Provide at least one field to update."
        );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set: updatedData
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category updated successfully.",
            {
                category: updatedCategory
            }
        )
    );

});

export const deleteCategory = asyncHandler(async (req, res) => {

    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(
            404,
            "Category not found."
        );
    }

    const blogsCount = await Blog.countDocuments({
        category: categoryId
    });

    if (blogsCount > 0) {
        throw new ApiError(
            400,
            "Category cannot be deleted because it is assigned to existing blogs."
        );
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category deleted successfully."
        )
    );

});

export const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find().sort({ name: 1 }).lean()

    return res.status(200).json(new ApiResponse(
        200,
        "All Categories are fetched successfully.",
        { categories }
    ))

});

// export const getSingleCategory = asyncHandler(async (req, res) => {

//     const { categoryId } = req.params;

//     const category = await Category.findById(categoryId);

//     if (!category) {
//         throw new ApiError(
//             404,
//             "Category not found."
//         )
//     }

//     return res.status(200).json(new ApiResponse(
//         200,
//         "Categoty fetched successfully.",
//         { category }
//     ))

// }); 