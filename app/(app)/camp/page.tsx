import { CampView } from "@/components/camp/CampView";

export default async function CampPage({
  searchParams,
}: {
  searchParams: Promise<{ hackathon?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const hackathonParam = resolvedSearchParams.hackathon;
  const initialHackathonSlug = Array.isArray(hackathonParam)
    ? hackathonParam[0]
    : hackathonParam;

  return <CampView initialHackathonSlug={initialHackathonSlug} />;
}
