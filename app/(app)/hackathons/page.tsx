"use client";

import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HackathonsPage() {
  const { dict } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title={dict.appPages?.hackathonsTitle || "Hackathons"}
        description={dict.appPages?.hackathonsDesc || "Discover events"}
      />
      <div className="mt-8">
        <EmptyState
          title={dict.appPages?.hackathonsEmpty || "No hackathons found"}
          description={dict.appPages?.hackathonsEmptyDesc || "There are currently no hackathons available. Check back later."}
        />
      </div>
    </div>
  );
}
