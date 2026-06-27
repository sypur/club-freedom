import z from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, {
      error: "Name must be at least 2 characters long",
    })
    .max(50, {
      error: "Name must be at most 50 characters long",
    }),
  slug: z
    .string()
    .min(2, {
      error: "Slug must be at least 2 characters long",
    })
    .max(50, {
      error: "Slug must be at most 50 characters long",
    })
    .refine((data) => /^[a-z0-9-]+$/.test(data), {
      error:
        "Only contains lower letters (a-z), numbers (0-9), and hyphens (-)",
    })
    .refine((data) => !data.startsWith("-") && !data.endsWith("-"), {
      error: "Slug should not begin or end with hypen (-)",
    }),
  email: z.email(),
});

export type Organization = z.infer<typeof organizationSchema>;
