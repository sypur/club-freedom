import z from "zod";

function isColorValid(color: string) {
  const node = new Option();
  node.style.color = color;
  return (
    !!node.style.color &&
    !/(unset|initial|inherit|currentcolor|transparent)/i.test(color)
  );
}

const colorString = z
  .string()
  .refine(isColorValid, { message: "Invalid color" });

export const themeSchema = z.object({
  primary: colorString,
  "primary-foreground": colorString,
  secondary: colorString,
  "secondary-foreground": colorString,
  destructive: colorString,
});

export type Theme = z.infer<typeof themeSchema>;
