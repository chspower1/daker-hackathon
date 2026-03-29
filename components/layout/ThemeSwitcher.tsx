"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useSyncExternalStore } from "react";

function subscribeToHydration(onStoreChange: () => void) {
  const frame = window.requestAnimationFrame(onStoreChange);
  return () => window.cancelAnimationFrame(frame);
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { dict } = useI18n();
  const isDark = theme === "dark";
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const label = isHydrated ? (isDark ? dict.misc.switchToLightMode : dict.misc.switchToDarkMode) : dict.misc.toggleTheme;
  const statusLabel = isDark ? dict.misc.darkModeEnabled : dict.misc.lightModeEnabled;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-content-muted transition-colors hover:bg-surface-subtle hover:text-content-base"
      aria-label={label}
      aria-pressed={isHydrated ? isDark : undefined}
      title={label}
    >
      <span className="sr-only">{isHydrated ? `${statusLabel}. ${label}` : label}</span>
      <svg className="absolute transition-all duration-300 dark:opacity-0 dark:scale-0 dark:-rotate-90 opacity-100 scale-100 rotate-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg className="absolute transition-all duration-300 opacity-0 scale-0 rotate-90 dark:opacity-100 dark:scale-100 dark:rotate-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
