import type { UserRankingEntry } from "@/types";

const rankingsSeed: UserRankingEntry[] = [
  { rank: 1, nickname: "neon-nova", points: 2450 },
  { rank: 2, nickname: "pixel-river", points: 2310 },
  { rank: 3, nickname: "luna-stack", points: 2180 },
  { rank: 4, nickname: "delta-spark", points: 1950 },
];

export function listSeedRankings(): UserRankingEntry[] {
  return structuredClone(rankingsSeed);
}
