import { z } from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const imageFileValidation = z
  .instanceof(FileList)
  .refine((files) => files.length > 0, "Image is required.")
  .refine((files) => files[0]?.size <= MAX_IMAGE_SIZE, "Image must be less than 2 MB.")
  .refine(
    (files) => ALLOWED_IMAGE_TYPES.includes(files[0]?.type),
    "Only JPG, PNG, or WebP images are allowed."
  );

export const profilePictureSchema = z.object({
  avatar: imageFileValidation,
});

export const updateProfileSchema = z.object({
  userName: z.string().trim().min(3, "Username must be at least 3 characters."),

  contact: z
    .string()
    .trim()
    .regex(/^\d+$/, "Contact must contain only numbers.")
    .min(11, "Contact must be at least 11 characters.")
    .max(15, "Contact cannot exceed 15 characters."),

  cnic: z
    .string()
    .trim()
    .regex(/^\d+$/, "CNIC must contain only numbers.")
    .length(13, "CNIC must be exactly 13 characters."),

  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender.",
  }),

  country: z.string().trim().min(1, "Please select a country."),

  province: z.string().trim().min(1, "Please select a province/state."),

  city: z.string().trim().min(1, "Please select a city."),

  town: z.string().trim().min(3, "Town must be at least 3 characters."),
});

export const bioValidationSchema = z.object({
  bio: z.string().trim().min(1, "Bio is required.").max(300, "Bio cannot exceed 300 characters."),
});
