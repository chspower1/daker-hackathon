"use client";

import { use } from "react";
import { CampView } from "@/components/camp/CampView";

export default function CampPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = props.searchParams ? use(props.searchParams) : undefined;
  const hackathonSlug = typeof resolvedParams?.hackathon === "string" ? resolvedParams.hackathon : undefined;

  return (
    <div className="max-w-7xl mx-auto">
      <CampView initialHackathonSlug={hackathonSlug} />
    </div>
  );
}
