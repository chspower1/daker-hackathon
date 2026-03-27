import { listSeedTeamPosts } from "@/lib/data";
import { readWithRecovery, writeValue } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";
import {
  isArrayOf,
  isBoolean,
  isOptionalNumber,
  isOptionalString,
  isOptionalStringArray,
  isRecord,
  isString,
  isStringArray,
} from "@/lib/storage/validation";
import type { TeamPost } from "@/types";

function isTeamPost(value: unknown): value is TeamPost {
  if (!isRecord(value)) {
    return false;
  }

  const {
    teamCode,
    hackathonSlug,
    ownerProfileId,
    ownerNicknameSnapshot,
    name,
    isOpen,
    memberCount,
    lookingFor,
    teamStyle,
    intro,
    contact,
    createdAt,
  } = value;

  return (
    isString(teamCode)
    && isOptionalString(hackathonSlug)
    && isOptionalString(ownerProfileId)
    && isOptionalString(ownerNicknameSnapshot)
    && isString(name)
    && isBoolean(isOpen)
    && isOptionalNumber(memberCount)
    && isStringArray(lookingFor)
    && isOptionalStringArray(teamStyle)
    && isString(intro)
    && isRecord(contact)
    && contact.type === "link"
    && isString(contact.url)
    && isString(createdAt)
  );
}

const teamsCodec = {
  getSeed: listSeedTeamPosts,
  isValid: (value: unknown): value is TeamPost[] => isArrayOf(value, isTeamPost),
};

export function readTeams() {
  return readWithRecovery(storageKeys.teams, teamsCodec);
}

export function writeTeams(teamPosts: TeamPost[]) {
  return writeValue(storageKeys.teams, teamPosts);
}
