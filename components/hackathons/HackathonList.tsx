"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/design-system/primitives/Badge";
import { Button } from "@/components/design-system/primitives/Button";
import { Input } from "@/components/design-system/primitives/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { DataTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/design-system/primitives/DataTable";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { getSafeTimestamp, parseSafeDate } from "@/lib/runtimeGuards";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import { cn } from "@/lib/cn";
import type { HackathonStatus, HackathonSummary } from "@/types";

type SortField = "title" | "status" | "startDate" | "endDate";
type SortOrder = "asc" | "desc";

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
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [keywordSearch, setKeywordSearch] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const result = readHackathons();

      if (!result.available) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      setHackathons(result.value);
      setHasError(false);
      setIsLoading(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
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

  const visibleTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags;
    const query = tagSearchQuery.trim().toLowerCase();
    return availableTags.filter((t) => t.toLowerCase().includes(query));
  }, [availableTags, tagSearchQuery]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, upcoming: 0, ongoing: 0, ended: 0 };
    hackathons.forEach((h) => {
      const tagMatches = tagFilter.length === 0 || tagFilter.some((t) => h.tags.includes(t));
      const keyword = keywordSearch.trim().toLowerCase();
      const keywordMatches = !keyword || h.title.toLowerCase().includes(keyword) || h.tags.some((t) => t.toLowerCase().includes(keyword));
      if (tagMatches && keywordMatches) {
        counts.all++;
        if (h.status === "upcoming") counts.upcoming++;
        if (h.status === "ongoing") counts.ongoing++;
        if (h.status === "ended") counts.ended++;
      }
    });
    return counts;
  }, [hackathons, tagFilter, keywordSearch]);

  const filteredHackathons = useMemo(() => {
    let result = hackathons.filter((h) => {
      const statusMatches = statusFilter === "all" || h.status === statusFilter;
      const tagMatches = tagFilter.length === 0 || tagFilter.some((t) => h.tags.includes(t));
      const keyword = keywordSearch.trim().toLowerCase();
      const keywordMatches = !keyword || h.title.toLowerCase().includes(keyword) || h.tags.some((t) => t.toLowerCase().includes(keyword));
      return statusMatches && tagMatches && keywordMatches;
    });

    if (viewMode === "table") {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortField === "title") {
          cmp = a.title.localeCompare(b.title, languageTag);
        } else if (sortField === "status") {
          cmp = a.status.localeCompare(b.status, languageTag);
        } else if (sortField === "startDate") {
          const dateA = getSafeTimestamp(a.period.startAt);
          const dateB = getSafeTimestamp(b.period.startAt);
          cmp = dateA - dateB;
        } else if (sortField === "endDate") {
          const dateA = getSafeTimestamp(a.period.endAt);
          const dateB = getSafeTimestamp(b.period.endAt);
          cmp = dateA - dateB;
        }
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [hackathons, statusFilter, tagFilter, keywordSearch, viewMode, sortField, sortOrder, languageTag]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  
  const renderSortIcon = (field: SortField) => {
    const isActive = sortField === field;
    return (
      <span className={cn(
        "ml-1.5 inline-flex items-center text-[10px] transition-colors",
        isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "text-content-subtle group-hover:text-content-muted"
      )}>
        {isActive ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
      </span>
    );
  };

  const listText = dict.hackathonList;
  const hasActiveSidebarFilters = statusFilter !== "all" || tagFilter.length > 0 || tagSearchQuery.trim().length > 0 || keywordSearch.trim().length > 0;

  const formatDate = (value?: string) => {
    const parsedDate = parseSafeDate(value);
    return parsedDate ? dateFormatter.format(parsedDate) : null;
  };

  if (isLoading) return <LoadingState label={dict.appPages.loadingLabel} />;
  if (hasError) return <ErrorState title={listText.errorTitle} message={listText.errorDescription} />;
  if (hackathons.length === 0) return <EmptyState title={dict.appPages.hackathonsEmpty} description={dict.appPages.hackathonsEmptyDesc} />;

  return (
    <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] flex flex-col">
        <div className="flex flex-col h-full bg-surface-muted/50 backdrop-blur-xl rounded-2xl border border-border-base/60 shadow-sm overflow-hidden">
          
          {/* 1. Header/Context */}
          <div className="shrink-0 p-5 bg-surface-base border-b border-border-base/60">
            <h1 className="text-xl font-extrabold tracking-tight text-content-base">{dict.appPages.hackathonsTitle}</h1>
            <p className="text-xs text-content-subtle mt-1.5 leading-relaxed">{dict.appPages.hackathonsDesc}</p>
          </div>

          {/* 2. Primary Controls */}
          <div className="shrink-0 p-5 border-b border-border-base/60 bg-surface-muted/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-content-subtle mb-3">{listText.filters.statusLabel}</h3>
            <div className="flex flex-col gap-1.5">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option;
                const label = option === "all" ? listText.filters.allStatuses : listText.status[option];
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setStatusFilter(option)}
                    className={cn(
                      "flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 font-medium border",
                      isActive 
                        ? "bg-surface-base text-blue-700 dark:text-blue-300 border-border-base/60 shadow-sm" 
                        : "bg-transparent text-content-muted border-transparent hover:bg-surface-subtle/50 hover:text-content-base"
                    )}
                  >
                    <span>{label}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      isActive ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" : "bg-surface-subtle text-content-subtle"
                    )}>
                      {statusCounts[option]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Scrollable Secondary Filters */}
          <div className="flex-1 min-h-0 flex flex-col p-5 bg-surface-base/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-content-subtle mb-3 shrink-0">{listText.filters.tagLabel}</h3>
            <div className="shrink-0 mb-4 space-y-3">
              <Input
                placeholder={listText.filters.searchTagsPlaceholder}
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                aria-label={listText.filters.searchTagsLabel}
                inputSize="md"
                className="bg-surface-base text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={tagFilter.length === 0}
                  onClick={() => setTagFilter([])}
                  className={cn(
                    "w-fit px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                    tagFilter.length === 0 ? "bg-content-base text-surface-base border-content-base font-semibold" : "bg-surface-base text-content-muted border-border-base hover:border-border-strong hover:bg-surface-muted"
                  )}
                >
                  {listText.filters.allTags}
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasActiveSidebarFilters}
                  className="w-fit justify-center text-content-muted hover:bg-surface-subtle hover:text-content-base border-border-base text-xs font-semibold disabled:cursor-default disabled:opacity-40"
                  onClick={() => { setStatusFilter("all"); setTagFilter([]); setTagSearchQuery(""); setKeywordSearch(""); }}
                >
                  {listText.filters.clear}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 pb-2 custom-scrollbar">
              <div className="flex flex-wrap gap-1.5 pb-2">
                {visibleTags.map((tag) => {
                  const isSelected = tagFilter.includes(tag);
                  return (
                     <button
                       key={tag}
                       type="button"
                       aria-pressed={isSelected}
                       onClick={() => {
                         setTagFilter((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs transition-all duration-200 border",
                        isSelected ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 font-semibold" : "bg-surface-base text-content-muted border-border-base hover:border-border-strong hover:bg-surface-muted"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
                {visibleTags.length === 0 && (
                  <p className="w-full text-xs text-content-subtle py-4 text-center">
                    {listText.filters.noTagsFound}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </aside>

      <main className="flex-1 w-full min-w-0">
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <p className="text-sm font-medium text-content-subtle whitespace-nowrap">
            {listText.resultsFound.replace("{count}", String(filteredHackathons.length))}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input
              placeholder={listText.filters.searchKeywordPlaceholder}
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              aria-label={listText.filters.searchKeywordLabel}
              inputSize="md"
              className="w-full sm:w-64"
            />
            <div className="flex bg-surface-subtle p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", viewMode === "card" ? "bg-surface-base text-content-base shadow-sm" : "text-content-muted hover:text-content-base")}
              >
                {listText.viewModeCard}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", viewMode === "table" ? "bg-surface-base text-content-base shadow-sm" : "text-content-muted hover:text-content-base")}
              >
                {listText.viewModeTable}
              </button>
            </div>
          </div>
        </div>


        {filteredHackathons.length === 0 ? (
          <EmptyState title={listText.emptyFilteredTitle} description={listText.emptyFilteredDescription} />
        ) : viewMode === "table" ? (
            <DataTable>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16 select-none">
                    <div className="flex items-center">
                      {listText.tableColumns.thumbnail}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "title" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("title")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.title} {renderSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "status" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.status} {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "startDate" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("startDate")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.startDate} {renderSortIcon("startDate")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "endDate" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("endDate")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.endDate} {renderSortIcon("endDate")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHackathons.map((hackathon) => (
                  <TableRow key={hackathon.slug}>
                    <TableCell>
                      {hackathon.thumbnailUrl ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-muted border border-border-muted relative shrink-0">
                          {imageErrors[hackathon.slug] ? (
                            <div className="h-full w-full bg-surface-subtle/50 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-surface-subtle flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-primary-subtle/60" />
                              </div>
                            </div>
                          ) : (
                            <Image
                              alt={hackathon.title}
                              className="h-full w-full object-cover"
                              fill
                              sizes="48px"
                              src={hackathon.thumbnailUrl}
                              onError={() => setImageErrors((prev) => ({ ...prev, [hackathon.slug]: true }))}
                              unoptimized
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-muted border border-border-muted relative shrink-0">
                           <div className="h-full w-full bg-surface-subtle/50 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-surface-subtle flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-primary-subtle/60" />
                              </div>
                            </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={hackathon.links.detail} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {hackathon.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(hackathon.status)}>
                        {listText.status[hackathon.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(hackathon.period.startAt) ?? "-"}</TableCell>
                    <TableCell>{formatDate(hackathon.period.endAt) ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredHackathons.map((hackathon) => {
              const startDate = formatDate(hackathon.period.startAt);
              const deadlineDate = formatDate(hackathon.period.submissionDeadlineAt);
              const endDate = formatDate(hackathon.period.endAt);

              return (
                <Link key={hackathon.slug} href={hackathon.links.detail} className="group block h-full">
                  <Card className="h-full flex flex-col group border border-border-base/60 shadow-sm hover:shadow-lg hover:shadow-primary-base/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-surface-base overflow-hidden">
                    {hackathon.thumbnailUrl && (
                      <div className="aspect-[16/9] overflow-hidden bg-surface-muted border-b border-border-muted relative">
                        {imageErrors[hackathon.slug] ? (
                          <div className="h-full w-full bg-surface-subtle/50 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-primary-subtle/60" />
                            </div>
                          </div>
                        ) : (
                           <Image
                             alt={hackathon.title}
                             className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                             fill
                             sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw"
                             src={hackathon.thumbnailUrl}
                             onError={() => setImageErrors((prev) => ({ ...prev, [hackathon.slug]: true }))}
                             unoptimized
                           />
                         )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide border whitespace-nowrap shadow-sm backdrop-blur-md", hackathon.status === "ongoing" ? "bg-primary-subtle/90 text-primary-base border-primary-base/20 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800" : hackathon.status === "upcoming" ? "bg-surface-subtle/90 text-content-base border-border-strong" : "bg-surface-base/90 text-content-subtle border-border-base")}>
                            {listText.status[hackathon.status]}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="space-y-3 bg-surface-muted/50 border-b border-border-muted pb-4 px-5 pt-5 transition-colors duration-300">
                      <CardTitle className="text-lg font-bold tracking-tight text-content-base group-hover:text-primary-base transition-colors line-clamp-2">
                        {hackathon.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-5 flex-1 flex flex-col">
                      <div className="mt-4 flex flex-col justify-end space-y-3 border-t border-border-muted pt-4 text-sm">
                        {startDate && endDate && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <span className="font-semibold text-content-subtle">{listText.labels.period}</span>
                            <span className="text-left sm:text-right font-semibold text-content-base max-w-full sm:max-w-[150px] line-clamp-2">{startDate} - {endDate}</span>
                          </div>
                        )}
                        {deadlineDate && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4 text-red-600 dark:text-red-400">
                            <span className="font-semibold">{listText.labels.deadline}</span>
                            <span className="text-left sm:text-right font-bold">{deadlineDate}</span>
                          </div>
                        )}
                        
                        {hackathon.tags.length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-border-muted">
                            <div className="flex flex-wrap gap-1.5">
                              {hackathon.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="bg-primary-subtle text-primary-base px-2 py-0.5 text-[11px] font-semibold rounded dark:bg-blue-900/30 dark:text-blue-300">
                                  {tag}
                                </span>
                              ))}
                              {hackathon.tags.length > 3 && (
                                 <span className="bg-surface-muted text-content-subtle px-2 py-0.5 text-[11px] font-semibold rounded">
                                  +{hackathon.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
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
