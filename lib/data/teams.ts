import publicTeams from "@/docs/requirements/예시자료/public_teams.json";
import type { TeamPost } from "@/types";

const seedTeamStyleByCode: Record<string, string[]> = {
  "T-ALPHA": ["Experiment-driven", "Technical validation"],
  "T-BETA": ["Product-minded", "UX collaboration"],
  "T-HANDOVER-01": ["Fast execution", "Builder-first"],
  "T-HANDOVER-02": ["Structured", "Documentation-friendly"],
};

function normalizeTeamPost(teamPost: (typeof publicTeams)[number]): TeamPost {
  return {
    teamCode: teamPost.teamCode,
    hackathonSlug: teamPost.hackathonSlug,
    name: teamPost.name,
    isOpen: teamPost.isOpen,
    memberCount: teamPost.memberCount,
    lookingFor: [...teamPost.lookingFor],
    teamStyle: [...(seedTeamStyleByCode[teamPost.teamCode] ?? [])],
    intro: teamPost.intro,
    contact: {
      type: "link",
      url: teamPost.contact.url,
    },
    createdAt: teamPost.createdAt,
  };
}

export function listSeedTeamPosts(): TeamPost[] {
  return publicTeams.map((teamPost) => normalizeTeamPost(teamPost));
}

export function listSeedTeamPostsByHackathon(hackathonSlug: string) {
  return listSeedTeamPosts().filter((teamPost) => teamPost.hackathonSlug === hackathonSlug);
}
