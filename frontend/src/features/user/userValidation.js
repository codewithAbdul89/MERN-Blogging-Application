import { z } from "zod";

export const userOtpSchema = z.object({
    otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits.")
        .regex(/^\d+$/, "OTP must contain only numbers")
});