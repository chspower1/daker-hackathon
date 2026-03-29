import { localeCookieName, localeStorageKey, type Locale } from "./config";

function writeLocaleMirror(locale: Locale) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(localeStorageKey, locale);
    return true;
  } catch {
    return false;
  }
}

function syncLocaleDocument(locale: Locale) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale;
}

export function persistLocale(locale: Locale) {
  writeLocaleMirror(locale);
  syncLocaleDocument(locale);
}
