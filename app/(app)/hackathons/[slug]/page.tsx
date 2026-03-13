"use client";

import { use } from "react";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HackathonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { dict } = useI18n();
  const { slug } = use(params);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title={`${dict.appPages?.hackathonDetailTitle || "Hackathon Detail"}: ${slug}`}
        description={dict.appPages?.hackathonDetailDesc || "Hackathon info"}
      />
      <div className="mt-8">
        <EmptyState
          title={dict.appPages?.hackathonDetailEmpty || "Content not found"}
          description={dict.appPages?.hackathonDetailEmptyDesc || "The details for this hackathon are not available yet."}
        />
      </div>
    </div>
  );
}
