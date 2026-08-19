import { z } from "zod";

export const createBlogSchema = z.object({

    title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters")
        .max(120, "Title cannot exceed 120 characters"),

    content: z
        .string()
        .trim()
        .min(100, "Content must be at least 100 characters"),

    category: z
        .string()
        .min(1, "Category is required"),

    tags: z
        .array(
            z.string()
                .trim()
                .min(2, "Each tag must be at least 2 characters")
                .max(6, "Each tag cannot exceed 6 characters")
        )
        .min(1, "At least one tag is required")
        .max(5, "Maximum 5 tags"),

    status: z
        .string()
        .trim()
        .enum(["DRAFT", "PUBLISHED"]),

    featuredImage: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, {
            message: "Featured image is required",
        })

});

export const updateBlogSchema = createBlogSchema
    .partial()
    .refine(
        (data) =>
            data.title !== undefined ||
            data.content !== undefined ||
            data.category !== undefined ||
            data.tags !== undefined ||
            data.status !== undefined ||
            data.featuredImage !== undefined,
        {
            message: "At least one field is required."
        }
    );

export const blogOtpSchema = z.object({
    otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits.")
        .regex(/^\d+$/, "OTP must contain only numbers")
});

