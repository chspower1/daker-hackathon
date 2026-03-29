"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isTheme, type Theme } from "./config";
import { applyTheme, getSystemTheme, persistTheme, readStoredTheme } from "./persistence";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      const themeFromDataset = document.documentElement.dataset.theme ?? null;

      if (isTheme(themeFromDataset)) {
        return themeFromDataset;
      }
    }

    return readStoredTheme() ?? getSystemTheme();
  });

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
