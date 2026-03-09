import z from "zod";

const formatSchema = z.union([
  z.literal("audio"),
  z.literal("video"),
  z.literal("text"),
]);

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  formats: z
    .array(formatSchema)
    .min(1, {
      error: "At least one format must be selected",
    })
    .max(3),
  agreements: z
    .array(
      z.object({
        value: z.string().min(1, "Agreement should not be empty"),
      }),
    )
    .min(1)
    .max(3),
});

export type FormSchema = z.infer<typeof formSchema>;

export const defaultAgreement =
  "I agree that my personal information and testimonial may be processed and published on this service.";
