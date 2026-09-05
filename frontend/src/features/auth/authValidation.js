import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Invalid email address"),

  password: z
    .string()
    .trim()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters.")
    .max(12, "Password cannot exceed 12 characters."),

  rememberMe: z.boolean().optional(),
});

export const registerSchema = loginSchema
  .extend({
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username cannot exceed 30 characters."),
    confirmPassword: z.string().trim().min(1, "Please confirm your password."),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Invalid email address"),
});

export const emailLoginOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits.")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const changePasswordSchema = z
  .object({
    previousPassword: z
      .string()
      .trim()
      .min(1, "Previous password is required."),

    newPassword: z
      .string()
      .trim()
      .min(6, "New password must be at least 6 characters.")
      .max(12, "New password cannot exceed 12 characters."),
      
    confirmPassword: z
    .string()
    .trim()
    .min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters.")
      .max(12, "Password cannot exceed 12 characters."),

    confirmPassword: z.string().trim().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
