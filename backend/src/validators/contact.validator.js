import { body } from "express-validator";

export const contactEmailValidator = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address."),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Subject must be between 3 and 100 characters."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .bail()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters."),
];
