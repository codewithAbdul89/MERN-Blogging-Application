import { body, param } from "express-validator"

export const createCategoryValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage("Category must be between 3 and 50 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage("Description cannot exceed 300 characters.")
];


export const updateCategoryValidator = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage("Category must be between 3 and 50 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage("Description cannot exceed 300 characters."),

    body().custom((value) => {

        if (!value.name && !value.description) {
            throw new Error(
                "At least one field (name or description) is required."
            );
        }

        return true;
    })
];

