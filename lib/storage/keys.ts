export const storageKeys = {
  localProfile: "localProfile",
  hackathons: "hackathons",
  teams: "teams",
  submissions: "submissions",
  leaderboards: "leaderboards",
  rankings: "rankings",
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
