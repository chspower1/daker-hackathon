import { listSeedLeaderboards } from "@/lib/data";
import { readWithRecovery, type StorageReadResult, writeValue } from "@/lib/storage/client";
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
import type { Leaderboard, LeaderboardEntry, LeaderboardStatus } from "@/types";

type PersistedLeaderboardStatus = LeaderboardStatus | "미제출";

interface PersistedLeaderboardEntry extends Omit<LeaderboardEntry, "status"> {
  status?: PersistedLeaderboardStatus;
}

interface PersistedLeaderboard extends Omit<Leaderboard, "entries"> {
  entries: PersistedLeaderboardEntry[];
}

function isLeaderboardEntry(value: unknown): value is PersistedLeaderboardEntry {
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
    && (status === undefined || status === "submitted" || status === "unsubmitted" || status === "미제출")
  );
}

function isLeaderboard(value: unknown): value is PersistedLeaderboard {
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
  isValid: (value: unknown): value is PersistedLeaderboard[] => isArrayOf(value, isLeaderboard),
};

function normalizeLeaderboardStatus(status: PersistedLeaderboardStatus | undefined): LeaderboardStatus | undefined {
  if (status === "미제출") {
    return "unsubmitted";
  }

  return status;
}

function normalizeLeaderboardEntry(entry: PersistedLeaderboardEntry): LeaderboardEntry {
  return {
    ...entry,
    status: normalizeLeaderboardStatus(entry.status),
  };
}

function normalizeLeaderboard(leaderboard: PersistedLeaderboard): Leaderboard {
  return {
    ...leaderboard,
    entries: leaderboard.entries.map(normalizeLeaderboardEntry),
  };
}

export function readLeaderboards(): StorageReadResult<Leaderboard[]> {
  const result = readWithRecovery(storageKeys.leaderboards, leaderboardsCodec);

  return {
    ...result,
    value: result.value.map(normalizeLeaderboard),
  };
}

export function writeLeaderboards(leaderboards: Leaderboard[]) {
  return writeValue(storageKeys.leaderboards, leaderboards);
}
