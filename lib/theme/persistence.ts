import { isTheme, themeStorageKey, type Theme } from "./config";

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function persistTheme(theme: Theme): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(themeStorageKey, theme);
    return true;
  } catch {
    return false;
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.classList.toggle("dark", theme === "dark");
}
