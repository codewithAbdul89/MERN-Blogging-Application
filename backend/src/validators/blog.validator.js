import { body, param } from 'express-validator'


export const createBlogValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .bail()
        .isLength({
            min: 5,
            max: 150
        })
        .withMessage("Title must be between 5 and 150 characters."),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content  is required."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .bail()
        .isMongoId()
        .withMessage("Invalid blog id"),


    body("tags")
        .optional()
        .isArray({ min: 1, max: 5 })
        .withMessage("tag should be between 1 and 6 is required."),

    body("tags.*")
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("Each tag must be between 2 and 30 characters.")

];

export const singleBlogValidator = [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug is required")
];

export const updateBlogValidator = [

    param("blogId")
        .trim()
        .notEmpty()
        .withMessage("Blog Id is required")
        .bail()
        .isMongoId()
        .withMessage("Invalid blog id"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .bail()
        .isLength({
            min: 5,
            max: 150
        })
        .withMessage("Title must be between 5 and 150 characters."),

    body("content")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Content is required."),

    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .bail()
        .isMongoId()
        .withMessage("Invalid category id"),

    body("tags")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one tag is required."),

    body("tags.*")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage(
            "Each tag must be between 2 and 30 characters."
        ),

    body("status")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .bail()
        .isIn(["DRAFT", "PUBLISHED", "REMOVED"])
        .withMessage(
            "Status must be either DRAFT, PUBLISHED, or REMOVED"
        ),

    // At least one update field is required
    body().custom((value) => {

        if (
            value.title === undefined &&
            value.content === undefined &&
            value.category === undefined &&
            value.tags === undefined &&
            value.status === undefined
        ) {
            throw new Error(
                "At least one field is required for update."
            );
        }

        return true;
    })

];

export const verifyDeleteBlogOtpVelidation = [
    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage("Otp should be exact six digits.")
];
