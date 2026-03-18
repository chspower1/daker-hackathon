"use client";

import { HackathonList } from "@/components/hackathons/HackathonList";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HackathonsPage() {
  const { dict } = useI18n();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      <PageHeader
        title={dict.appPages?.hackathonsTitle || "Hackathons"}
        description={dict.appPages?.hackathonsDesc || "Discover and join upcoming events."}
      />
      <HackathonList />
    </div>
  );
}
