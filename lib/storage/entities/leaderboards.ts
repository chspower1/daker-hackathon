import { listSeedLeaderboards } from "@/lib/data";
import { readWithRecovery, writeValue } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";
import {
  isArrayOf,
  isNumber,
  isOptionalNumber,
  isOptionalRecordOfNumbers,
  isOptionalString,
  isRecord,
  isString,
} from "@/lib/storage/validation";
import type { Leaderboard, LeaderboardEntry } from "@/types";

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (!isRecord(value)) {
    return false;
  }

  const { rank, teamName, score, submittedAt, scoreBreakdown, artifacts, status } = value;

  return (
    (rank === undefined || isNumber(rank))
    && isString(teamName)
    && isOptionalNumber(score)
    && isOptionalString(submittedAt)
    && isOptionalRecordOfNumbers(scoreBreakdown)
    && (artifacts === undefined || (
      isRecord(artifacts)
      && isOptionalString(artifacts.webUrl)
      && isOptionalString(artifacts.pdfUrl)
      && isOptionalString(artifacts.planTitle)
    ))
    && (status === undefined || status === "submitted" || status === "미제출")
  );
}

function isLeaderboard(value: unknown): value is Leaderboard {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.hackathonSlug)
    && isString(value.updatedAt)
    && isArrayOf(value.entries, isLeaderboardEntry)
  );
}

const leaderboardsCodec = {
  getSeed: listSeedLeaderboards,
  isValid: (value: unknown): value is Leaderboard[] => isArrayOf(value, isLeaderboard),
};

export function readLeaderboards() {
  return readWithRecovery(storageKeys.leaderboards, leaderboardsCodec);
}

export function writeLeaderboards(leaderboards: Leaderboard[]) {
  return writeValue(storageKeys.leaderboards, leaderboards);
}
