import type { Locale } from "./config";
import { en, type Dictionary } from "./locales/en";
import { ko } from "./locales/ko";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ko,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
