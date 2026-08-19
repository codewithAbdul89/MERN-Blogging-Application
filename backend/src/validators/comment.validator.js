import { body, param } from "express-validator";

export const createCommentValidaotr = [

    param("blogId")
        .trim()
        .notEmpty()
        .withMessage("Blog Id is required.")
        .bail()
        .isMongoId()
        .withMessage("Id is not valid."),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Text is required.")
        .bail()
        .isLength({
            min: 1,
            max: 1000
        })
        .withMessage("Comment must be between 1 and 1000 characters.")

];

export const updateCommentValidator = [

    param("commentId")
        .trim()
        .notEmpty()
        .withMessage("Blog Id is required.")
        .bail()
        .isMongoId()
        .withMessage("Id is not valid."),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Text is required.")
        .bail()
        .isLength({
            min: 1,
            max: 1000
        })
        .withMessage("Comment must be between 1 and 1000 characters."),

];

