import z from "zod";

export const testimonialSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address").or(z.literal("")),
    media: z
      .instanceof(Blob, { error: "Please record your testimonial" })
      .optional(),
    writtenText: z.string(),
    agreementsAccepted: z
      .array(z.string())
      .min(1, "You must accept all agreements"),
    turnstileToken: z.string().min(1, "Please complete the human verification"),
  })
  .superRefine((data, ctx) => {
    if (
      (!data.writtenText || data.media) &&
      (data.writtenText || !data.media)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide your testimonial",
        path: ["writtenText"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Please provide your testimonial",
        path: ["mediaFile"],
      });
    }
  });

export const emailSchema = z.email({
  message: "Please enter a valid email address",
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
