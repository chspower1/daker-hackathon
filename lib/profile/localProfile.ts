import { createLocalProfileId } from "@/lib/ids/local";
import { readLocalProfile, writeLocalProfile } from "@/lib/storage";
import type { LocalProfile } from "@/types";

export function createLocalProfile(nickname: string, date = new Date()): LocalProfile {
  const timestamp = date.toISOString();

  return {
    id: createLocalProfileId(date),
    nickname,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getLocalProfile() {
  return readLocalProfile().value;
}

export function hasLocalProfile() {
  return getLocalProfile() !== null;
}

export function saveLocalProfile(profile: LocalProfile | null) {
  return writeLocalProfile(profile);
}

export function renameLocalProfile(profile: LocalProfile, nickname: string, date = new Date()): LocalProfile {
  return {
    ...profile,
    nickname,
    updatedAt: date.toISOString(),
  };
}
