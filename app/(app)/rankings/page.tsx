"use client";

import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function RankingsPage() {
  const { dict } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title={dict.appPages?.rankingsTitle || "Rankings"}
        description={dict.appPages?.rankingsDesc || "Global leaderboard"}
      />
      <div className="mt-8">
        <EmptyState
          title={dict.appPages?.rankingsEmpty || "No rankings available"}
          description={dict.appPages?.rankingsEmptyDesc || "The season has just started. Submit your projects to appear here."}
        />
      </div>
    </div>
  );
}
