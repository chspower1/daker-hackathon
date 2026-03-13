import { listSeedHackathons } from "@/lib/data";
import { readWithRecovery, writeValue } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";
import {
  isArrayOf,
  isOptionalString,
  isRecord,
  isString,
  isStringArray,
} from "@/lib/storage/validation";
import type { HackathonSummary } from "@/types";

function isHackathonSummary(value: unknown): value is HackathonSummary {
  if (!isRecord(value)) {
    return false;
  }

  const { slug, title, status, tags, thumbnailUrl, period, links } = value;

  return (
    isString(slug)
    && isString(title)
    && (status === "upcoming" || status === "ongoing" || status === "ended")
    && isStringArray(tags)
    && isOptionalString(thumbnailUrl)
    && isRecord(period)
    && isString(period.timezone)
    && isOptionalString(period.submissionDeadlineAt)
    && isOptionalString(period.endAt)
    && isOptionalString(period.startAt)
    && isRecord(links)
    && isString(links.detail)
    && isOptionalString(links.rules)
    && isOptionalString(links.faq)
  );
}

const hackathonsCodec = {
  getSeed: listSeedHackathons,
  isValid: (value: unknown): value is HackathonSummary[] => isArrayOf(value, isHackathonSummary),
};

export function readHackathons() {
  return readWithRecovery(storageKeys.hackathons, hackathonsCodec);
}

export function writeHackathons(hackathons: HackathonSummary[]) {
  return writeValue(storageKeys.hackathons, hackathons);
}
