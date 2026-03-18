#!/bin/bash

# 1. Rankings Page (Adjust container, headers, paddings, text sizes)
cat << 'INNER_EOF' > app/\(app\)/rankings/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import {
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/design-system/primitives/DataTable";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { readRankings } from "@/lib/storage/entities/rankings";
import type { UserRankingEntry } from "@/types";
import { storageKeys } from "@/lib/storage/keys";

export default function RankingsPage() {
  const { dict } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [rankings, setRankings] = useState<UserRankingEntry[]>([]);

  const loadData = useCallback(() => {
    const result = readRankings();
    if (!result.available) {
      setIsError(true);
    } else {
      setIsError(false);
      const sorted = [...result.value].sort((a, b) => a.rank - b.rank);
      
      setRankings((prev) => {
        const isSame = prev.length === sorted.length && 
          prev.every((p, i) => 
            p.rank === sorted[i].rank && 
            p.nickname === sorted[i].nickname && 
            p.points === sorted[i].points
          );
        return isSame ? prev : sorted;
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(loadData, 0);
    const interval = setInterval(loadData, 1000);

    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKeys.rankings) {
        loadData();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadData]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <PageHeader
        title={dict.appPages?.rankingsTitle || "Rankings"}
        description={dict.appPages?.rankingsDesc || "Global leaderboard"}
      />
      <div className="mt-8">
        {isLoading ? (
          <LoadingState label={dict.appPages?.loadingLabel} />
        ) : isError ? (
          <ErrorState 
            title={dict.appPages?.errorTitle} 
            message={dict.appPages?.errorDesc} 
            onRetry={loadData}
          />
        ) : rankings.length === 0 ? (
          <EmptyState
            title={dict.appPages?.rankingsEmpty || "No rankings available"}
            description={dict.appPages?.rankingsEmptyDesc || "The season has just started. Submit your projects to appear here."}
          />
        ) : (
          <div className="p-4 md:p-6 border-2 border-content-base bg-white shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
            <DataTable>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">{dict.misc?.tableRank || "Rank"}</TableHead>
                  <TableHead>{dict.misc?.tableNickname || "Nickname"}</TableHead>
                  <TableHead className="text-right">{dict.misc?.tablePoints || "Points"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((entry, idx) => (
                  <TableRow key={`${entry.rank}-${entry.nickname}`} className={idx < 3 ? "bg-yellow-50" : ""}>
                    <TableCell className="font-bold text-base">
                      {idx === 0 ? "🏆" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${entry.rank}`}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{entry.nickname}</TableCell>
                    <TableCell className="text-right font-mono text-base font-bold text-primary-base">{entry.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
}
INNER_EOF

# 2. Hackathons Page Container
cat << 'INNER_EOF' > app/\(app\)/hackathons/page.tsx
"use client";

import { HackathonList } from "@/components/hackathons/HackathonList";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HackathonsPage() {
  const { dict } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <PageHeader
        title={dict.appPages?.hackathonsTitle || "Hackathons"}
        description={dict.appPages?.hackathonsDesc || "Discover and join upcoming events."}
      />
      <HackathonList />
    </div>
  );
}
INNER_EOF

# 3. Camp Page Container
cat << 'INNER_EOF' > app/\(app\)/camp/page.tsx
"use client";

import { use } from "react";
import { CampView } from "@/components/camp/CampView";

export default function CampPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = props.searchParams ? use(props.searchParams) : undefined;
  const hackathonSlug = typeof resolvedParams?.hackathon === "string" ? resolvedParams.hackathon : undefined;

  return (
    <div className="max-w-7xl mx-auto">
      <CampView initialHackathonSlug={hackathonSlug} />
    </div>
  );
}
INNER_EOF

echo "App pages updated"
