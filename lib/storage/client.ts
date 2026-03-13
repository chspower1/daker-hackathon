import type { StorageKey } from "./keys";
import { safeJsonParse, safeJsonStringify } from "./json";

export interface StorageCodec<T> {
  getSeed: () => T;
  isValid: (value: unknown) => value is T;
  persistSeedOnMissing?: boolean;
}

export interface StorageReadResult<T> {
  value: T;
  available: boolean;
  recovered: boolean;
}

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function writeValue<T>(key: StorageKey, value: T) {
  const storage = getBrowserStorage();

  if (storage === null) {
    return false;
  }

  const serialized = safeJsonStringify(value);

  if (!serialized.ok) {
    return false;
  }

  try {
    storage.setItem(key, serialized.value);
    return true;
  } catch {
    return false;
  }
}

export function readWithRecovery<T>(key: StorageKey, codec: StorageCodec<T>): StorageReadResult<T> {
  const storage = getBrowserStorage();

  if (storage === null) {
    return {
      value: codec.getSeed(),
      available: false,
      recovered: false,
    };
  }

  const rawValue = storage.getItem(key);

  if (rawValue === null) {
    const seed = codec.getSeed();

    if (codec.persistSeedOnMissing === false) {
      return {
        value: seed,
        available: true,
        recovered: false,
      };
    }

    return {
      value: seed,
      available: true,
      recovered: writeValue(key, seed),
    };
  }

  const parsed = safeJsonParse(rawValue);

  if (!parsed.ok || !codec.isValid(parsed.value)) {
    const seed = codec.getSeed();

    return {
      value: seed,
      available: true,
      recovered: writeValue(key, seed),
    };
  }

  return {
    value: parsed.value,
    available: true,
    recovered: false,
  };
}
