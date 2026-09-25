import z from "zod";

export const contactValidationSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  email: z.string().trim().email("Please enter a valid email address."),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(100, "Subject cannot exceed 100 characters."),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message cannot exceed 2000 characters."),
});
