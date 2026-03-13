import { readWithRecovery, writeValue } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";
import { isRecord, isString } from "@/lib/storage/validation";
import type { LocalProfile } from "@/types";

function isLocalProfile(value: unknown): value is LocalProfile {
  return (
    isRecord(value)
    && isString(value.id)
    && isString(value.nickname)
    && isString(value.createdAt)
    && isString(value.updatedAt)
  );
}

const localProfileCodec = {
  getSeed: (): LocalProfile | null => null,
  isValid: (value: unknown): value is LocalProfile | null => value === null || isLocalProfile(value),
  persistSeedOnMissing: false,
};

export function readLocalProfile() {
  return readWithRecovery(storageKeys.localProfile, localProfileCodec);
}

export function writeLocalProfile(profile: LocalProfile | null) {
  return writeValue(storageKeys.localProfile, profile);
}
