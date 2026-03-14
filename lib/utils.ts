import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isCapital(ch: string) {
  return ch === ch.toUpperCase() && ch !== ch.toLowerCase();
}

export function applyTheme(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, val]) => {
    let newKeyName: string = "--";

    for (let i = 0; i < key.length; i++) {
      if (isCapital(key[i])) newKeyName += `-${key[i].toLowerCase()}`;
      else newKeyName += key[i];
    }
    root.style.setProperty(newKeyName, val);
  });
}

export const defaultThemeVariables = {
  radius: "0.625rem",
  primary: "oklch(31.96% 0.1 216.6)",
  primaryForeground: "hsl(0 0% 98%)",
  background: "hsl(0 0% 100%)",
  foreground: "hsl(0 0% 3.9%)",
  secondary: "hsl(210 30% 60%)",
  secondaryForeground: "hsl(210 50% 25%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(0 0% 3.9%)",
  muted: "hsl(210 25% 90%)",
  mutedForeground: "hsl(210 15% 50%)",
  accent: "hsl(200 40% 60%)",
  accentForeground: "hsl(200 70% 20%)",
  destructive: "hsl(0 84% 60%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(210 10% 80%)",
  input: "hsl(210 20% 93%)",
  ring: "hsl(210 30% 50%)",
  popover: "hsl(0 0% 100%)",
  chart1: "oklch(0.646 0.222 41.116)",
  chart2: "oklch(0.6 0.118 184.704)",
  chart3: "oklch(0.398 0.07 227.392)",
  chart4: "oklch(0.828 0.189 84.429)",
  chart5: "oklch(0.769 0.188 70.08)",
  sidebar: "hsl(0 0% 98%)",
  sidebarForeground: "hsl(0 0% 3.9%)",
  sidebarPrimary: "oklch(31.96% 0.1 216.6)",
  sidebarPrimaryForeground: "hsl(0 0% 98%)",
  sidebarAccent: "hsl(200 40% 60%)",
  sidebarAccentForeground: "hsl(200 70% 20%)",
  sidebarBorder: "hsl(210 10% 80%)",
  sidebarRing: "hsl(210 30% 50%)",
};
