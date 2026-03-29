"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";
import type { Dictionary } from "./locales/en";
import { persistLocale } from "./persistence";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    setLocaleState(nextLocale);
  }, [locale]);

  const value = useMemo<I18nContextType>(
    () => ({
      locale,
      setLocale,
      dict: getDictionary(locale),
    }),
    [locale, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (context === null) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
