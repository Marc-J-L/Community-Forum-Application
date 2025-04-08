import { z } from "zod";

export const editPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  text: z.string().min(1, "Text is required"),
  images: z.array(z.string().url()).optional(),
  visibility: z.enum(["public", "private", "only-me"], { required_error: "Visibility is required" }),
});

