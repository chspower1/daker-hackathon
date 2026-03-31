import { readWithRecovery, writeValue } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";
import {
  isArrayOf,
  isDateString,
  isOptionalDateString,
  isOptionalString,
  isRecord,
  isString,
  isOptionalRecordOfStrings,
} from "@/lib/storage/validation";
import type { SubmissionRecord } from "@/types";

function isSubmissionRecord(value: unknown): value is SubmissionRecord {
  if (!isRecord(value)) {
    return false;
  }

  const {
    id,
    hackathonSlug,
    profileId,
    profileNicknameSnapshot,
    teamName,
    status,
    notes,
    artifacts,
    submittedAt,
    updatedAt,
  } = value;

  return (
    isString(id)
    && isString(hackathonSlug)
    && isOptionalString(profileId)
    && isOptionalString(profileNicknameSnapshot)
    && isString(teamName)
    && (status === "draft" || status === "submitted")
    && isOptionalString(notes)
    && isOptionalRecordOfStrings(artifacts)
    && artifacts !== undefined
    && isOptionalDateString(submittedAt)
    && isDateString(updatedAt)
  );
}

const submissionsCodec = {
  getSeed: (): SubmissionRecord[] => [],
  isValid: (value: unknown): value is SubmissionRecord[] => isArrayOf(value, isSubmissionRecord),
};

export function readSubmissions() {
  return readWithRecovery(storageKeys.submissions, submissionsCodec);
}

export function writeSubmissions(submissions: SubmissionRecord[]) {
  return writeValue(storageKeys.submissions, submissions);
}
