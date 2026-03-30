"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getLocalProfile, loginAs, logout } from "@/lib/profile/localProfile";
import { storageChangeEventName, type StorageChangeDetail } from "@/lib/storage/events";
import { storageKeys } from "@/lib/storage/keys";
import type { LocalProfile } from "@/types";

export function HeaderAuth() {
  const { dict } = useI18n();
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setProfile(getLocalProfile());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKeys.localProfile) {
        setProfile(getLocalProfile());
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<StorageChangeDetail>;
      if (customEvent.detail.key === storageKeys.localProfile) {
        setProfile(getLocalProfile());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(storageChangeEventName, handleCustomChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(storageChangeEventName, handleCustomChange as EventListener);
    };
  }, []);

  const handleLogin = () => {
    const profileId = window.prompt(dict.auth.enterProfileId);
    if (profileId && profileId.trim().length > 0) {
      loginAs(profileId.trim());
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3 ml-2">
      {profile ? (
        <div className="flex items-center bg-surface-muted/50 border border-border-base/50 rounded-full pl-1.5 pr-1.5 py-1 shadow-sm gap-2 transition-colors hover:bg-surface-muted/80">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-surface-subtle border border-border-strong flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-content-muted">
                {profile.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-semibold text-content-base max-w-[80px] sm:max-w-[120px] truncate">
              {profile.nickname}
            </span>
          </div>
          <div className="w-px h-3.5 bg-border-base mx-0.5"></div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-semibold px-2 py-1 rounded-full text-content-subtle hover:text-content-base hover:bg-surface-base transition-colors shrink-0"
          >
            {dict.auth.logout}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          className="text-sm font-semibold px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          {dict.auth.login}
        </button>
      )}
    </div>
  );
}
