import { z } from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageFileValidation = z
  .instanceof(FileList)
  .refine((files) => files.length > 0, "Image is required.")
  .refine(
    (files) => files[0]?.size <= MAX_IMAGE_SIZE,
    "Image must be less than 2 MB.",
  )
  .refine(
    (files) => ALLOWED_IMAGE_TYPES.includes(files[0]?.type),
    "Only JPG, PNG, or WebP images are allowed.",
  );

export const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title cannot exceed 120 characters."),

  content: z.string().trim().min(50, "Content must be at least 50 characters."),

  category: z.string().trim().min(1, "Category is required."),

  tags: z
    .array(z.string().trim().min(2, "Tag must be at least 2 characters."))
    .min(1, "At least one tag is required.")
    .max(4, "Maximum 4 tags allowed."),

  featuredImage: imageFileValidation,
});

const optionalImageFileSchema = z.preprocess((value) => {
  // optional mean if the image  is not changed by the user then  value is null or undefined do not run imageValidation and if it has value then run the image validator
  if (
    value === null ||
    value === undefined ||
    (value instanceof FileList && value.length === 0)
  ) {
    return undefined;
  }

  return value;
}, imageFileValidation.optional());

export const updateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title cannot exceed 120 characters.")
    .optional(),

  content: z
    .string()
    .trim()
    .min(50, "Content must be at least 50 characters.")
    .optional(),

  category: z.string().trim().min(1, "Category is required.").optional(),

  tags: z
    .array(z.string().trim().min(2, "Tag must be at least 2 characters."))
    .min(1, "At least one tag is required.")
    .max(4, "Maximum 4 tags allowed.")
    .optional(),

  featuredImage: optionalImageFileSchema,

   status: z
    .enum(["DRAFT", "PUBLISHED"])
    .optional(),
});
