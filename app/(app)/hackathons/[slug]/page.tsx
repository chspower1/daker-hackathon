"use client";

import { use } from "react";
import { HackathonDetailContent } from "@/components/hackathons/HackathonDetailContent";

export default function HackathonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <HackathonDetailContent slug={slug} />
    </div>
  );
}
