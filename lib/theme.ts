import { v, Infer } from "convex/values";

export const themeSchema = v.object({
  background: v.optional(v.string()),
  foreground: v.optional(v.string()),
  primary: v.optional(v.string()),
  primaryForeground: v.optional(v.string()),
  secondary: v.optional(v.string()),
  secondaryForeground: v.optional(v.string()),
  muted: v.optional(v.string()),
  mutedForeground: v.optional(v.string()),
  accent: v.optional(v.string()),
  accentForeground: v.optional(v.string()),
  destructive: v.optional(v.string()),
});

type RawTheme = Infer<typeof themeSchema>;

type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Uppercase<T>
    ? `-${Lowercase<T>}${CamelToKebab<U>}`
    : `${T}${CamelToKebab<U>}`
  : S;

type CameltoCSSVar<S extends string> = `--${CamelToKebab<S>}`;

export type CSSTheme = {
  [K in keyof RawTheme as CameltoCSSVar<K>]: RawTheme[K];
};

export type ThemeKey = CameltoCSSVar<keyof RawTheme>;

export function camelToCSSVar<S extends string>(s: S) {
  const kebab = s.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return `--${kebab}`;
}

export function convertToCSSVar(variablesObject: RawTheme) {
  const transformed = Object.fromEntries(
    Object.entries(variablesObject).map(([key, val]) => [
      camelToCSSVar(key),
      val,
    ]),
  );

  return transformed as CSSTheme;
}
