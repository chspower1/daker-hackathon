"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { readRankings } from "@/lib/storage/entities/rankings";
import type { UserRankingEntry } from "@/types";
import { storageKeys } from "@/lib/storage/keys";

export default function RankingsPage() {
  const { dict, locale } = useI18n();

  useDocumentMetadata({
    title: `${dict.appPages.rankingsTitle} | ${dict.metadata.shortName}`,
    description: dict.appPages.rankingsDesc,
  });

  const languageTag = useMemo(() => toLanguageTag(locale), [locale]);

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
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 relative selection:bg-blue-600 selection:text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600 opacity-[0.03] filter blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm mb-4">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          {dict.misc.rankingsBadge}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-2">
          {dict.appPages.rankingsTitle}
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl">
          {dict.appPages.rankingsDesc}
        </p>
      </div>

      <div className="mt-6 relative z-10">
        {isLoading ? (
          <LoadingState label={dict.appPages.loadingLabel} />
        ) : isError ? (
          <ErrorState 
            title={dict.appPages.errorTitle} 
            message={dict.appPages.errorDesc} 
            onRetry={loadData}
          />
        ) : rankings.length === 0 ? (
          <EmptyState
            title={dict.appPages.rankingsEmpty}
            description={dict.appPages.rankingsEmptyDesc}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium w-20">{dict.misc.tableRank}</th>
                    <th className="py-3 px-4 font-medium">{dict.misc.tableNickname}</th>
                    <th className="py-3 px-4 font-medium text-right">{dict.misc.tablePoints}</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((entry, idx) => (
                    <tr key={`${entry.rank}-${entry.nickname}`} className={`group transition-colors duration-200 hover:bg-slate-50 ${idx !== rankings.length - 1 ? 'border-b border-slate-100' : ''} ${idx < 3 ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-3 px-4 text-base">
                        {idx === 0 ? <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="animate-pulse">🏆</span><span className="text-sm text-slate-500 font-semibold tabular-nums">#1</span></span> : idx === 1 ? <span className="inline-flex items-center gap-1.5"><span aria-hidden="true">🥈</span><span className="text-sm text-slate-500 font-semibold tabular-nums">#2</span></span> : idx === 2 ? <span className="inline-flex items-center gap-1.5"><span aria-hidden="true">🥉</span><span className="text-sm text-slate-500 font-semibold tabular-nums">#3</span></span> : <span className="text-slate-500 font-semibold tabular-nums">#{entry.rank}</span>}
                        </td>
                      <td className="py-3 px-4 text-slate-900 font-semibold text-base group-hover:text-blue-600 transition-colors">
                        {entry.nickname}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 font-medium text-right text-base tabular-nums">
                        {entry.points.toLocaleString(languageTag)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
