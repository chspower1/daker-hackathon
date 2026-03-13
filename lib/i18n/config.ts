export const locales = ["en", "ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "app-locale";
export const localeStorageKey = "app-locale";

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && locales.some((locale) => locale === value);
}

export function toLanguageTag(locale: Locale) {
  return locale === "ko" ? "ko-KR" : "en-US";
}
