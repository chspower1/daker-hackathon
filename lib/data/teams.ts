import publicTeams from "@/docs/requirements/예시자료/public_teams.json";
import type { TeamPost } from "@/types";

function normalizeTeamPost(teamPost: (typeof publicTeams)[number]): TeamPost {
  return {
    teamCode: teamPost.teamCode,
    hackathonSlug: teamPost.hackathonSlug,
    name: teamPost.name,
    isOpen: teamPost.isOpen,
    memberCount: teamPost.memberCount,
    lookingFor: [...teamPost.lookingFor],
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
