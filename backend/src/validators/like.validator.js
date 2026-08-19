import { param } from "express-validator";

export const toggleLikeValidator=[

    param("blogId")
    .trim()
    .notEmpty()
    .withMessage("Blog Id is required.")
    .bail()
    .isMongoId()
    .withMessage("Id is not valid.")

]