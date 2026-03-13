"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <fieldset className="flex items-center gap-2 border-0 p-0 m-0">
      <legend className="sr-only">{dict.languageSwitcher.label}</legend>
      <button
        aria-label={dict.languageSwitcher.english}
        aria-pressed={locale === "en"}
        type="button"
        onClick={() => setLocale("en")}
        className={`text-xs font-medium transition-colors ${
          locale === "en" ? "text-primary-base" : "text-content-muted hover:text-content-base"
        }`}
      >
        EN
      </button>
      <span className="text-content-muted text-xs">/</span>
      <button
        aria-label={dict.languageSwitcher.korean}
        aria-pressed={locale === "ko"}
        type="button"
        onClick={() => setLocale("ko")}
        className={`text-xs font-medium transition-colors ${
          locale === "ko" ? "text-primary-base" : "text-content-muted hover:text-content-base"
        }`}
      >
        KO
      </button>
    </fieldset>
  );
}
