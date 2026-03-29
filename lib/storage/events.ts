import type { StorageKey } from "./keys";

export const storageChangeEventName = "hackplatform:storage-change";

export interface StorageChangeDetail {
  key: StorageKey;
}

export function dispatchStorageChange(key: StorageKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<StorageChangeDetail>(storageChangeEventName, {
      detail: { key },
    }),
  );
}
