"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/design-system/primitives/Badge";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { listSeedHackathons } from "@/lib/data/hackathons";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import { cn } from "@/lib/cn";
import type { HackathonStatus, HackathonSummary } from "@/types";

const statusOptions: Array<"all" | HackathonStatus> = ["all", "upcoming", "ongoing", "ended"];

function getStatusBadgeVariant(status: HackathonStatus) {
  if (status === "ongoing") return "success" as const;
  if (status === "upcoming") return "info" as const;
  return "default" as const;
}

export function HackathonList() {
  const { dict, locale } = useI18n();

  useDocumentMetadata({
    title: `${dict.appPages.hackathonsTitle} | ${dict.metadata.shortName}`,
    description: dict.appPages.hackathonsDesc,
  });

  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const result = readHackathons();
      setHackathons(result.value.length > 0 ? result.value : listSeedHackathons());
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const languageTag = toLanguageTag(locale);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(languageTag, { dateStyle: "medium" }), [languageTag]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach((h) => {
      h.tags.forEach((t) => {
        tags.add(t);
      });
    });
    return [...tags].sort((a, b) => a.localeCompare(b, languageTag));
  }, [hackathons, languageTag]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, upcoming: 0, ongoing: 0, ended: 0 };
    hackathons.forEach((h) => {
      const tagMatches = tagFilter.length === 0 || tagFilter.some((t) => h.tags.includes(t));
      if (tagMatches) {
        counts.all++;
        if (h.status === "upcoming") counts.upcoming++;
        if (h.status === "ongoing") counts.ongoing++;
        if (h.status === "ended") counts.ended++;
      }
    });
    return counts;
  }, [hackathons, tagFilter]);

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((h) => {
      const statusMatches = statusFilter === "all" || h.status === statusFilter;
      const tagMatches = tagFilter.length === 0 || tagFilter.some((t) => h.tags.includes(t));
      return statusMatches && tagMatches;
    });
  }, [hackathons, statusFilter, tagFilter]);

  const listText = dict.hackathonList;

  const formatDate = (value?: string) => value ? dateFormatter.format(new Date(value)) : null;

  if (isLoading) return <LoadingState label={dict.appPages.loadingLabel} />;
  if (hasError) return <ErrorState title={listText.errorTitle} message={listText.errorDescription} />;
  if (hackathons.length === 0) return <EmptyState title={dict.appPages.hackathonsEmpty} description={dict.appPages.hackathonsEmptyDesc} />;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <aside className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <div className="space-y-6 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {dict.nav.discover}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dict.appPages.hackathonsTitle}</h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{dict.appPages.hackathonsDesc}</p>
            </div>
          </div>
          <div className="h-px bg-slate-200 w-full"></div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">{listText.filters.statusLabel}</h3>
            <div className="flex flex-col gap-1">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option;
                const label = option === "all" ? listText.filters.allStatuses : listText.status[option];
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className={cn(
                      "flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 font-medium",
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <span>{label}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      {statusCounts[option]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">{listText.filters.tagLabel}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTagFilter([])}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                  tagFilter.length === 0 ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {listText.filters.allTags}
              </button>
              {availableTags.map((tag) => {
                const isSelected = tagFilter.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setTagFilter((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                      isSelected ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {(statusFilter !== "all" || tagFilter.length > 0) && (
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-slate-600 hover:bg-slate-100 border-slate-200"
                onClick={() => { setStatusFilter("all"); setTagFilter([]); }}
              >
                {listText.filters.clear}
              </Button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 w-full min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500">
            {listText.resultsFound.replace("{count}", String(filteredHackathons.length))}
          </p>
        </div>

        {filteredHackathons.length === 0 ? (
          <EmptyState title={listText.emptyFilteredTitle} description={listText.emptyFilteredDescription} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredHackathons.map((hackathon) => {
              const startDate = formatDate(hackathon.period.startAt);
              const deadlineDate = formatDate(hackathon.period.submissionDeadlineAt);
              const endDate = formatDate(hackathon.period.endAt);

              return (
                <Link key={hackathon.slug} href={hackathon.links.detail} className="group block h-full">
                  <Card className="h-full flex flex-col group border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-white overflow-hidden">
                    {hackathon.thumbnailUrl && (
                      <div className="aspect-[16/9] overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                        {imageErrors[hackathon.slug] ? (
                          <div className="h-full w-full bg-slate-100/50 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100/50" />
                            </div>
                          </div>
                        ) : (
                          <img
                            alt={hackathon.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={hackathon.thumbnailUrl}
                            onError={() => setImageErrors((prev) => ({ ...prev, [hackathon.slug]: true }))}
                          />
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge variant={getStatusBadgeVariant(hackathon.status)} className="shadow-sm backdrop-blur-md bg-white/90">
                            {listText.status[hackathon.status]}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader className="space-y-2 bg-slate-50/50 border-b border-slate-100 pb-4 px-5 pt-5 transition-colors duration-300">
                      <CardTitle className="group-hover:text-blue-600 transition-colors duration-300 text-lg leading-tight line-clamp-2">
                        {hackathon.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow space-y-4 p-5 pt-4">
                      <div className="mt-auto space-y-1.5 text-xs text-slate-600">
                        {startDate && endDate && (
                          <div className="flex justify-between items-center">
                            <span>{listText.labels.period}</span>
                            <span className="font-medium text-slate-900">{startDate} - {endDate}</span>
                          </div>
                        )}
                        {deadlineDate && (
                          <div className="flex justify-between items-center text-red-600">
                            <span>{listText.labels.deadline}</span>
                            <span className="font-semibold">{deadlineDate}</span>
                          </div>
                        )}
                        {"participantsCount" in hackathon && (
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                            <span>{listText.labels.participants}</span>
                            <span className="font-medium text-slate-900">
                              {(hackathon as HackathonSummary & { participantsCount?: number }).participantsCount?.toLocaleString(languageTag)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                        {hackathon.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                            {tag}
                          </span>
                        ))}
                        {hackathon.tags.length > 3 && (
                           <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-500">
                            +{hackathon.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
