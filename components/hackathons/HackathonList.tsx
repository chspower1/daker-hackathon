"use client";

import { useEffect, useMemo, useState } from "react";
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
import { listSeedHackathons } from "@/lib/data/hackathons";
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
          const dateA = a.period.startAt ? new Date(a.period.startAt).getTime() : 0;
          const dateB = b.period.startAt ? new Date(b.period.startAt).getTime() : 0;
          cmp = dateA - dateB;
        } else if (sortField === "endDate") {
          const dateA = a.period.endAt ? new Date(a.period.endAt).getTime() : 0;
          const dateB = b.period.endAt ? new Date(b.period.endAt).getTime() : 0;
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
        isActive ? "text-blue-600 font-bold" : "text-slate-300 group-hover:text-slate-400"
      )}>
        {isActive ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
      </span>
    );
  };

  const listText = dict.hackathonList;

  const formatDate = (value?: string) => value ? dateFormatter.format(new Date(value)) : null;

  if (isLoading) return <LoadingState label={dict.appPages.loadingLabel} />;
  if (hasError) return <ErrorState title={listText.errorTitle} message={listText.errorDescription} />;
  if (hackathons.length === 0) return <EmptyState title={dict.appPages.hackathonsEmpty} description={dict.appPages.hackathonsEmptyDesc} />;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <aside className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="shrink-0 space-y-6">
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
                    aria-pressed={isActive}
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
          </div>

          
          <div className="mt-6 flex flex-col min-h-0 flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 shrink-0">{listText.filters.searchKeywordLabel}</h3>
            <div className="shrink-0">
              <Input
                placeholder={listText.filters.searchKeywordPlaceholder}
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                aria-label={listText.filters.searchKeywordLabel}
                className="h-10 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col min-h-0 flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 shrink-0">{listText.filters.tagLabel}</h3>
            <div className="shrink-0">
              <Input
                placeholder={listText.filters.searchTagsPlaceholder}
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                aria-label={listText.filters.searchTagsLabel}
                className="h-10 rounded-xl text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  type="button"
                  aria-pressed={tagFilter.length === 0}
                  onClick={() => setTagFilter([])}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                    tagFilter.length === 0 ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {listText.filters.allTags}
                </button>
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
                        "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                        isSelected ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
                {visibleTags.length === 0 && (
                  <p className="w-full text-sm text-slate-500 py-4 text-center">
                    {listText.filters.noTagsFound}
                  </p>
                )}
              </div>
            </div>
          </div>

          {(statusFilter !== "all" || tagFilter.length > 0 || tagSearchQuery || keywordSearch) && (
            <div className="pt-4 mt-4 border-t border-slate-100 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-slate-600 hover:bg-slate-100 border-slate-200"
                onClick={() => { setStatusFilter("all"); setTagFilter([]); setTagSearchQuery(""); setKeywordSearch(""); }}
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
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", viewMode === "card" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900")}
            >
              {listText.viewModeCard}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900")}
            >
              {listText.viewModeTable}
            </button>
          </div>
        </div>


        {filteredHackathons.length === 0 ? (
          <EmptyState title={listText.emptyFilteredTitle} description={listText.emptyFilteredDescription} />
        ) : viewMode === "table" ? (
            <DataTable>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-slate-100/60 transition-colors select-none", sortField === "title" && "text-slate-900 bg-slate-50")}
                    onClick={() => toggleSort("title")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.title} {renderSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-slate-100/60 transition-colors select-none", sortField === "status" && "text-slate-900 bg-slate-50")}
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.status} {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-slate-100/60 transition-colors select-none", sortField === "startDate" && "text-slate-900 bg-slate-50")}
                    onClick={() => toggleSort("startDate")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.startDate} {renderSortIcon("startDate")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-slate-100/60 transition-colors select-none", sortField === "endDate" && "text-slate-900 bg-slate-50")}
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
                      <Link href={hackathon.links.detail} className="font-semibold text-blue-600 hover:underline">
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
