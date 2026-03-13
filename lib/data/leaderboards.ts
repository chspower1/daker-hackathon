import publicLeaderboard from "@/docs/requirements/예시자료/public_leaderboard.json";
import type { Leaderboard } from "@/types";

const leaderboardsSeed: Leaderboard[] = [
  {
    hackathonSlug: publicLeaderboard.hackathonSlug,
    updatedAt: publicLeaderboard.updatedAt,
    entries: publicLeaderboard.entries,
  },
  ...publicLeaderboard.extraLeaderboards.map((leaderboard) => ({
    hackathonSlug: leaderboard.hackathonSlug,
    updatedAt: leaderboard.updatedAt,
    entries: leaderboard.entries,
  })),
];

export function listSeedLeaderboards(): Leaderboard[] {
  return structuredClone(leaderboardsSeed);
}

export function findSeedLeaderboard(hackathonSlug: string) {
  return listSeedLeaderboards().find((leaderboard) => leaderboard.hackathonSlug === hackathonSlug);
}
