import publicHackathonDetail from "@/docs/requirements/예시자료/public_hackathon_detail.json";
import publicHackathons from "@/docs/requirements/예시자료/public_hackathons.json";
import type { HackathonDetail, HackathonSummary } from "@/types";

function normalizeHackathonStatus(status: string): HackathonSummary["status"] {
  if (status === "upcoming" || status === "ongoing" || status === "ended") {
    return status;
  }

  return "upcoming";
}

function normalizeHackathonSummary(hackathon: (typeof publicHackathons)[number]): HackathonSummary {
  const startAt = "startAt" in hackathon.period && typeof hackathon.period.startAt === "string"
    ? hackathon.period.startAt
    : undefined;

  return {
    slug: hackathon.slug,
    title: hackathon.title,
    status: normalizeHackathonStatus(hackathon.status),
    tags: [...hackathon.tags],
    thumbnailUrl: hackathon.thumbnailUrl,
    period: {
      timezone: hackathon.period.timezone,
      submissionDeadlineAt: hackathon.period.submissionDeadlineAt,
      endAt: hackathon.period.endAt,
      startAt,
    },
    links: {
      detail: hackathon.links.detail,
      rules: hackathon.links.rules,
      faq: hackathon.links.faq,
    },
  };
}

const primaryHackathonDetail: HackathonDetail = {
  slug: publicHackathonDetail.slug,
  title: publicHackathonDetail.title,
  sections: publicHackathonDetail.sections,
};

const extraHackathonDetails: HackathonDetail[] = publicHackathonDetail.extraDetails.map((detail) => ({
  slug: detail.slug,
  title: detail.title,
  sections: detail.sections,
}));

const allHackathonDetails: HackathonDetail[] = [primaryHackathonDetail, ...extraHackathonDetails];

export function listSeedHackathons(): HackathonSummary[] {
  return publicHackathons.map((hackathon) => normalizeHackathonSummary(hackathon));
}

export function findSeedHackathonSummary(slug: string) {
  return listSeedHackathons().find((hackathon) => hackathon.slug === slug);
}

export function listSeedHackathonDetails(): HackathonDetail[] {
  return structuredClone(allHackathonDetails);
}

export function findSeedHackathonDetail(slug: string) {
  return listSeedHackathonDetails().find((detail) => detail.slug === slug);
}
