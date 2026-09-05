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

    body("previousPassword")
        .trim()
        .notEmpty()
        .withMessage("Previous password is required.")
        .isLength({ min: 1, max: 12 })
        .withMessage("Password must be between 1 and 12 characters."),

    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required.")
        .bail()
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be between 6 and 12 characters.")
];

export const EmailValidator = [

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

    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage(" New Password is required.")
        .bail()
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be between 6 and 12 characters")
];

export const loginAccountOtpVelidaton = [
    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage("Otp should be exact sx digits.")
]