"use client";

import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <ErrorState
        title={dict.appPages.errorTitle}
        message={dict.appPages.errorDesc}
        onRetry={reset}
      />
    </div>
  );
}
