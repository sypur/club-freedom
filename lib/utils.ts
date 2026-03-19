import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function applyTheme(vars: Record<string, string>) {
  const bodyElement = document.body;
  Object.entries(vars).forEach(([key, val]) => {
    bodyElement.style.setProperty(key, val);
  });
}

export function clearTheme() {
  const bodyElement = document.body;
  Array.from(bodyElement.style).forEach((key) => {
    if (key.startsWith("--")) {
      bodyElement.style.removeProperty(key);
    }
  });
}
