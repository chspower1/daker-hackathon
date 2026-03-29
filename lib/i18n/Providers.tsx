"use client";

import type { Locale } from "./config";
import { I18nProvider } from "./I18nProvider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

export function Providers({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
