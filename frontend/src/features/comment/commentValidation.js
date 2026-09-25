import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(500, "Content should not exceeds 100 characters."),
});

// export const updateCommentSchema = createCommentSchema.partial();
