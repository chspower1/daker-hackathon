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
    <div className="max-w-7xl mx-auto px-6 py-12">
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
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">{dict.misc?.tableRank || "Rank"}</TableHead>
                <TableHead>{dict.misc?.tableNickname || "Nickname"}</TableHead>
                <TableHead className="text-right">{dict.misc?.tablePoints || "Points"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((entry) => (
                <TableRow key={`${entry.rank}-${entry.nickname}`}>
                  <TableCell className="font-medium">{entry.rank}</TableCell>
                  <TableCell>{entry.nickname}</TableCell>
                  <TableCell className="text-right">{entry.points.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        )}
      </div>
    </div>
  );
}
