import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function applyTheme(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
}

export function clearTheme() {
  const root = document.documentElement;
  Array.from(root.style).forEach((key) => {
    if (key.startsWith("--")) {
      root.style.removeProperty(key);
    }
  });
}
