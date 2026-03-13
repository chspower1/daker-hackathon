"use client";

import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function AppLoading() {
  const { dict } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <LoadingState label={dict.appPages.loadingLabel} />
    </div>
  );
}
