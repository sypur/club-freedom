import z from "zod";
import { isColorValid } from "@/lib/color";

const colorString = z
  .string()
  .refine(isColorValid, { message: "Invalid color" });

export const themeSchema = z.object({
  "--primary": colorString,
  "--primary-foreground": colorString,
  "--secondary": colorString,
  "--secondary-foreground": colorString,
  "--accent": colorString,
  "--accent-foreground": colorString,
  "--background": colorString,
  "--foreground": colorString,
  "--destructive": colorString,
});

export type Theme = z.infer<typeof themeSchema>;
