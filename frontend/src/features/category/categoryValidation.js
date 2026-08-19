import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Categoy name has atleast 3 characters.")
        .max(50, "Category name should be less then 50 characters."),

    description: z.
        string()
        .trim()
        .max(300, "Description should be less then 300 characters.")
        .optional()
});

export const updateCategorySchema = createCategorySchema
    .partial()
    .refine(
        (data) => data.name !== undefined || data.description !== undefined,

        //run this when false not on true
        {
            message: "At least one field is required.",
        }
    );