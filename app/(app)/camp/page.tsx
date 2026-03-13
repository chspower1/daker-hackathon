"use client";

import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function CampPage() {
  const { dict } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title={dict.appPages?.campTitle || "Camp"}
        description={dict.appPages?.campDesc || "Find your team"}
      />
      <div className="mt-8">
        <EmptyState
          title={dict.appPages?.campEmpty || "No teams looking for members"}
          description={dict.appPages?.campEmptyDesc || "Be the first to create a team and start recruiting."}
        />
      </div>
    </div>
  );
}
