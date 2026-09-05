import { z } from "zod";

export const userOtpSchema = z.object({
    otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits.")
        .regex(/^\d+$/, "OTP must contain only numbers")
});

export const updateProfileSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .optional(),

    contact: z
      .string()
      .trim()
      .regex(/^\d+$/, "Contact must contain only numbers.")
      .min(11, "Contact must be at least 11 characters.")
      .max(15, "Contact cannot exceed 15 characters.")
      .optional(),

    cnic: z
      .string()
      .trim()
      .regex(/^\d+$/, "CNIC must contain only numbers.")
      .length(13, "CNIC must be exactly 13 characters.")
      .optional(),

    gender: z
      .enum(["Male", "Female", "Other"], {
        message: "Invalid gender.",
      })
      .optional(),

    town: z
      .string()
      .trim()
      .min(3, "Town must be at least 3 characters.")
      .optional(),

    city: z
      .string()
      .trim()
      .min(3, "City must be at least 3 characters.")
      .optional(),

    province: z
      .string()
      .trim()
      .min(3, "Province must be at least 3 characters.")
      .optional(),

    country: z
      .string()
      .trim()
      .min(3, "Country must be at least 3 characters.")
      .optional(),
  })
  .refine(
    (data) =>
      data.userName !== undefined ||
      data.contact !== undefined ||
      data.cnic !== undefined ||
      data.gender !== undefined ||
      data.town !== undefined ||
      data.city !== undefined ||
      data.province !== undefined ||
      data.country !== undefined,
    {
      message: "At least one field is required.",
    },
  );