"use client";

import type { Locale } from "./config";
import { I18nProvider } from "./I18nProvider";

export function Providers({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  return (
    <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
  );
}
