import { body } from "express-validator";

export const signupValidation = [

    body("userName")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 Characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be between 6 and 12 characters")

];

export const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 1, max: 12 })
        .withMessage("Password must be between 1 and 12 characters.")

];

export const changePasswordValidator = [

    body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 1, max: 12 })
        .withMessage("Password must be between 1 and 12 characters."),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .bail()
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be between 6 and 12 characters")
];

export const resendVerificationEmailValidator = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .bail()
        .isEmail()
        .withMessage("Invalid email address.")

];

export const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format")
];

export const resetPasswordValidator = [

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .bail()
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be between 6 and 12 characters")
];