import { listSeedRankings } from "@/lib/data";
import { readWithRecovery, writeValue } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";
import { isArrayOf, isNumber, isRecord, isString } from "@/lib/storage/validation";
import type { UserRankingEntry } from "@/types";

function isUserRankingEntry(value: unknown): value is UserRankingEntry {
  return isRecord(value) && isNumber(value.rank) && isString(value.nickname) && isNumber(value.points);
}

const rankingsCodec = {
  getSeed: listSeedRankings,
  isValid: (value: unknown): value is UserRankingEntry[] => isArrayOf(value, isUserRankingEntry),
};

export function readRankings() {
  return readWithRecovery(storageKeys.rankings, rankingsCodec);
}

export function writeRankings(rankings: UserRankingEntry[]) {
  return writeValue(storageKeys.rankings, rankings);
}
