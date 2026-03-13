import type { StorageKey } from "@/lib/storage/keys";
import { storageKeys } from "@/lib/storage/keys";
import { readHackathons } from "./entities/hackathons";
import { readLeaderboards } from "./entities/leaderboards";
import { readRankings } from "./entities/rankings";
import { readSubmissions } from "./entities/submissions";
import { readTeams } from "./entities/teams";

export interface BootstrapStorageResult {
  available: boolean;
  recoveredKeys: StorageKey[];
}

export function bootstrapStorage(): BootstrapStorageResult {
  const checks = [
    { key: storageKeys.hackathons, result: readHackathons() },
    { key: storageKeys.teams, result: readTeams() },
    { key: storageKeys.submissions, result: readSubmissions() },
    { key: storageKeys.leaderboards, result: readLeaderboards() },
    { key: storageKeys.rankings, result: readRankings() },
  ];

  return {
    available: checks.every((check) => check.result.available),
    recoveredKeys: checks.filter((check) => check.result.recovered).map((check) => check.key),
  };
}
