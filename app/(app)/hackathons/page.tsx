"use client";

import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { HackathonList } from "@/components/hackathons/HackathonList";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";

export default function HackathonsPage() {
  const { dict } = useI18n();

  useDocumentMetadata({
    title: `${dict.appPages?.hackathonsTitle || "Hackathons"} - ${dict.metadata.title}`,
    description: dict.appPages?.hackathonsDesc || dict.metadata.description,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title={dict.appPages?.hackathonsTitle || "Hackathons"}
        description={dict.appPages?.hackathonsDesc || "Discover events"}
      />
      <div className="mt-8">
        <HackathonList />
      </div>
    </div>
  );
}
