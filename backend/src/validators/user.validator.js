import { body } from "express-validator";

export const updateProfileValidator = [

    body("userName")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("contact")
        .optional()
        .trim()
        .isLength({ min: 11, max: 15 })
        .withMessage("Contact must be between 11 and 15 characters"),

    body("cnic")
        .optional()
        .trim()
        .isLength({ min: 13, max: 13 })
        .withMessage("CNIC must be exactly 13 characters long.")
        .bail()
        .isNumeric()
        .withMessage("CNIC must contain only numbers."),

    body("gender")
        .optional()
        .isIn(["Male", "Female", "Other"])
        .withMessage("Invalid gender"),

    body("town")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Town must be at least 3 characters"),

    body("city")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("City must be at least 3 characters"),

    body("province")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Province must be at least 3 characters"),

    body("country")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Country must be at least 3 characters"),

    // At least one field is required
    body().custom((value) => {

        if (
            value.userName === undefined &&
            value.contact === undefined &&
            value.cnic === undefined &&
            value.gender === undefined &&
            value.town === undefined &&
            value.city === undefined &&
            value.province === undefined &&
            value.country === undefined
        ) {
            throw new Error(
                "At least one field is required."
            );
        }

        return true;
    })

];

export const deleteAccountOtpVelidaton = [
    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage("Otp should be exact sx digits.")
]