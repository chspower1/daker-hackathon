"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { DataTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/design-system/primitives/DataTable";
import { Input } from "@/components/design-system/primitives/Input";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { cn } from "@/lib/cn";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { getLocalProfile } from "@/lib/profile/localProfile";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import { readTeams, writeTeams } from "@/lib/storage/entities/teams";
import { CampWizardModal } from "./CampWizardModal";
import type { HackathonSummary, TeamPost } from "@/types";

interface CampViewProps {
  initialHackathonSlug?: string;
}

type Notice = {
  variant: "default" | "success" | "danger";
  title: string;
  description: string;
};

type TeamSubmitResult =
  | { ok: true }
  | { ok: false; title: string; description: string };

type CampStatusFilter = "all" | "open" | "closed";
type CampTagGroupId = "lookingFor" | "teamStyle";

type CampTagSelection = {
  groupId: CampTagGroupId;
  value: string;
};

type SortField = "teamName" | "owner" | "hackathon" | "status" | "lookingFor" | "createdAt";
type SortOrder = "asc" | "desc";

type CampTagGroup = {
  id: CampTagGroupId;
  label: string;
  tags: string[];
};

const statusOptions: CampStatusFilter[] = ["all", "open", "closed"];

function makeCampTagKey(groupId: CampTagGroupId, value: string) {
  return `${groupId}::${value}`;
}

function parseCampTagKey(key: string): CampTagSelection | null {
  const [groupId, ...rest] = key.split("::");
  const value = rest.join("::");

  if (value.length === 0) {
    return null;
  }

  if (groupId !== "lookingFor" && groupId !== "teamStyle") {
    return null;
  }

  return { groupId, value };
}

function matchesCampStatus(team: TeamPost, statusFilter: CampStatusFilter) {
  if (statusFilter === "all") {
    return true;
  }

  return statusFilter === "open" ? team.isOpen : !team.isOpen;
}

function matchesCampTag(team: TeamPost, selection: CampTagSelection) {
  if (selection.groupId === "lookingFor") {
    return team.lookingFor.includes(selection.value);
  }

  return (team.teamStyle ?? []).includes(selection.value);
}

export function CampView({ initialHackathonSlug }: CampViewProps) {
  const { dict, locale } = useI18n();
  const [isReady, setIsReady] = useState(false);
  const [teams, setTeams] = useState<TeamPost[]>([]);
  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [profile, setProfile] = useState<ReturnType<typeof getLocalProfile>>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CampStatusFilter>("all");
  const [selectedTagKeys, setSelectedTagKeys] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasModalOpen = useRef(false);

  const filterHackathonSlug = initialHackathonSlug?.trim() || undefined;
  const listText = dict.campList;

  useEffect(() => {
    if (isWizardOpen) {
      wasModalOpen.current = true;
    } else if (wasModalOpen.current) {
      triggerRef.current?.focus();
      wasModalOpen.current = false;
    }
  }, [isWizardOpen]);

  useEffect(() => {
    const teamResult = readTeams();
    const hackathonResult = readHackathons();

    startTransition(() => {
      setTeams(teamResult.value);
      setHackathons(hackathonResult.value);
      setProfile(getLocalProfile());
      setIsReady(true);
    });
  }, []);

  const activeHackathon = useMemo(
    () => hackathons.find((h) => h.slug === filterHackathonSlug),
    [filterHackathonSlug, hackathons],
  );

  const pageDescription = activeHackathon !== undefined
    ? `${dict.appPages.campDesc} ${activeHackathon.title}`
    : dict.appPages.campDesc;

  useDocumentMetadata({
    title: `${dict.appPages.campTitle} | ${dict.metadata.shortName}`,
    description: pageDescription,
  });

  const languageTag = toLanguageTag(locale);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(languageTag, { dateStyle: "medium", timeStyle: "short" }),
    [languageTag],
  );

  const baseTeams = useMemo(() => {
    const sortedTeams = [...teams].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));

    if (filterHackathonSlug === undefined) {
      return sortedTeams;
    }

    return sortedTeams.filter((team) => team.hackathonSlug === filterHackathonSlug);
  }, [filterHackathonSlug, teams]);

  const selectedTags = useMemo(() => {
    const nextSelectedTags: CampTagSelection[] = [];

    selectedTagKeys.forEach((key) => {
      const parsed = parseCampTagKey(key);
      if (parsed !== null) {
        nextSelectedTags.push(parsed);
      }
    });

    return nextSelectedTags;
  }, [selectedTagKeys]);

  const availableTagGroups = useMemo(() => {
    const lookingForTags = new Set<string>();
    const teamStyleTags = new Set<string>();

    baseTeams.forEach((team) => {
      team.lookingFor.forEach((tag) => {
        lookingForTags.add(tag);
      });

      (team.teamStyle ?? []).forEach((tag) => {
        teamStyleTags.add(tag);
      });
    });

    const sortTags = (tags: Set<string>) => {
      return [...tags].sort((left, right) => left.localeCompare(right, languageTag));
    };

    return [
      {
        id: "lookingFor",
        label: listText.filters.lookingForGroupLabel,
        tags: sortTags(lookingForTags),
      },
      {
        id: "teamStyle",
        label: listText.filters.teamStyleGroupLabel,
        tags: sortTags(teamStyleTags),
      },
    ] satisfies CampTagGroup[];
  }, [baseTeams, languageTag, listText.filters.lookingForGroupLabel, listText.filters.teamStyleGroupLabel]);

  const visibleTagGroups = useMemo(() => {
    const query = tagSearchQuery.trim().toLowerCase();

    if (query.length === 0) {
      return availableTagGroups;
    }

    return availableTagGroups
      .map((group) => ({
        ...group,
        tags: group.tags.filter((tag) => tag.toLowerCase().includes(query)),
      }))
      .filter((group) => group.tags.length > 0);
  }, [availableTagGroups, tagSearchQuery]);

  const hackathonTitleBySlug = useMemo(() => {
    return new Map(hackathons.map((h) => [h.slug, h.title]));
  }, [hackathons]);

  const statusCounts = useMemo(() => {
    const counts: Record<CampStatusFilter, number> = { all: 0, open: 0, closed: 0 };

    baseTeams.forEach((team) => {
      const tagMatches = selectedTags.length === 0 || selectedTags.some((selection) => matchesCampTag(team, selection));
      const keyword = keywordSearch.trim().toLowerCase();
      const hackathonTitle = team.hackathonSlug ? hackathonTitleBySlug.get(team.hackathonSlug) : "";
      const statusText = team.isOpen ? listText.statusOpen : listText.statusClosed;
      const keywordMatches = !keyword || 
        team.name.toLowerCase().includes(keyword) || 
        team.intro.toLowerCase().includes(keyword) || 
        (team.ownerNicknameSnapshot && team.ownerNicknameSnapshot.toLowerCase().includes(keyword)) || 
        (hackathonTitle && hackathonTitle.toLowerCase().includes(keyword)) ||
        team.lookingFor.some(r => r.toLowerCase().includes(keyword)) ||
        (team.teamStyle ?? []).some(s => s.toLowerCase().includes(keyword)) ||
        statusText.toLowerCase().includes(keyword);

      if (tagMatches && keywordMatches) {
        counts.all += 1;
        if (team.isOpen) {
          counts.open += 1;
        } else {
          counts.closed += 1;
        }
      }
    });

    return counts;
  }, [baseTeams, selectedTags, keywordSearch, hackathonTitleBySlug, listText.statusClosed, listText.statusOpen]);



    const filteredTeams = useMemo(() => {
    let result = baseTeams.filter((team) => {
      const statusMatches = matchesCampStatus(team, statusFilter);
      const tagMatches = selectedTags.length === 0 || selectedTags.some((selection) => matchesCampTag(team, selection));
      
      const keyword = keywordSearch.trim().toLowerCase();
      const hackathonTitle = team.hackathonSlug ? hackathonTitleBySlug.get(team.hackathonSlug) : "";
      const statusText = team.isOpen ? listText.statusOpen : listText.statusClosed;
      const keywordMatches = !keyword || 
        team.name.toLowerCase().includes(keyword) || 
        team.intro.toLowerCase().includes(keyword) || 
        (team.ownerNicknameSnapshot && team.ownerNicknameSnapshot.toLowerCase().includes(keyword)) || 
        (hackathonTitle && hackathonTitle.toLowerCase().includes(keyword)) ||
        team.lookingFor.some(r => r.toLowerCase().includes(keyword)) ||
        (team.teamStyle ?? []).some(s => s.toLowerCase().includes(keyword)) ||
        statusText.toLowerCase().includes(keyword);
      
      return statusMatches && tagMatches && keywordMatches;
    });

    if (viewMode === "table") {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortField === "teamName") {
          cmp = a.name.localeCompare(b.name, languageTag);
        } else if (sortField === "owner") {
          const ownerA = a.ownerNicknameSnapshot || "";
          const ownerB = b.ownerNicknameSnapshot || "";
          cmp = ownerA.localeCompare(ownerB, languageTag);
        } else if (sortField === "hackathon") {
          const hA = a.hackathonSlug ? hackathonTitleBySlug.get(a.hackathonSlug) || "" : "";
          const hB = b.hackathonSlug ? hackathonTitleBySlug.get(b.hackathonSlug) || "" : "";
          cmp = hA.localeCompare(hB, languageTag);
                } else if (sortField === "status") {
          cmp = (a.isOpen === b.isOpen) ? 0 : a.isOpen ? -1 : 1;
        } else if (sortField === "lookingFor") {
          const lA = a.lookingFor.join(", ");
          const lB = b.lookingFor.join(", ");
          cmp = lA.localeCompare(lB, languageTag);
        } else if (sortField === "createdAt") {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [baseTeams, selectedTags, statusFilter, keywordSearch, hackathonTitleBySlug, viewMode, sortField, sortOrder, languageTag, listText.statusClosed, listText.statusOpen]);

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
        isActive ? "text-blue-600 font-bold" : "text-content-subtle group-hover:text-content-muted"
      )}>
        {isActive ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
      </span>
    );
  };

  const hasActiveSidebarFilters = statusFilter !== "all" || selectedTagKeys.length > 0 || tagSearchQuery.trim().length > 0 || keywordSearch.trim().length > 0;

  const handleWizardSubmit = (newTeam: TeamPost): TeamSubmitResult => {
    const nextTeams = [newTeam, ...teams];

    if (!writeTeams(nextTeams)) {
      return {
        ok: false,
        title: dict.campForm.saveErrorTitle,
        description: dict.campForm.saveErrorDesc,
      };
    }

    setTeams(nextTeams);
    setIsWizardOpen(false);
    setNotice({
      variant: "success",
      title: dict.campForm.saveSuccessTitle,
      description: dict.campForm.saveSuccessDesc,
    });
    return { ok: true };
  };

  if (!isReady) {
    return <LoadingState label={dict.appPages.loadingLabel} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] flex flex-col">
        <div className="flex flex-col h-full bg-surface-muted/50 backdrop-blur-xl rounded-2xl border border-border-base/60 shadow-sm overflow-hidden">
          
          {/* 1. Header/Context */}
          <div className="shrink-0 p-5 bg-surface-base border-b border-border-base/60 relative">
            {filterHackathonSlug !== undefined && activeHackathon !== undefined && (
              <div className="mb-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">{listText.filterTitle}</p>
                    <p className="text-xs text-amber-900 font-medium line-clamp-1">{activeHackathon.title}</p>
                  </div>
                  <Link href="/camp" className="p-1 text-amber-700 hover:text-amber-900 bg-amber-100/50 hover:bg-amber-100 rounded-md transition-colors" title={dict.hackathonList.filters.clear}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </Link>
                </div>
              </div>
            )}
            <h1 className="text-xl font-extrabold tracking-tight text-content-base">{dict.appPages.campTitle}</h1>
            <p className="text-xs text-content-subtle mt-1.5 leading-relaxed">{pageDescription}</p>
            
            <div className="mt-4">
              <Button
                ref={triggerRef}
                variant="primary"
                className="w-full justify-center shadow-sm bg-blue-600 hover:bg-blue-700 font-semibold text-sm"
                onClick={() => {
                  setIsWizardOpen(true);
                  setNotice(null);
                }}
              >
                {dict.campForm.toggleOpen}
              </Button>
            </div>
          </div>

          {/* 2. Primary Controls */}
          <div className="shrink-0 p-5 border-b border-border-base/60 bg-surface-muted/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-content-subtle mb-3">{listText.filters.statusLabel}</h3>
            <div className="flex flex-col gap-1.5">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option;
                const label = option === "all"
                  ? listText.filters.allStatuses
                  : option === "open"
                    ? listText.statusOpen
                    : listText.statusClosed;

                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setStatusFilter(option)}
                    className={cn(
                      "flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 font-medium border",
                      isActive 
                        ? "bg-surface-base text-blue-700 border-border-base/60 shadow-sm" 
                        : "bg-transparent text-content-muted border-transparent hover:bg-surface-subtle/50 hover:text-content-base",
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        isActive ? "bg-blue-50 text-blue-600" : "bg-surface-subtle text-content-subtle",
                      )}
                    >
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
                onChange={(event) => setTagSearchQuery(event.target.value)}
                aria-label={listText.filters.searchTagsLabel}
                inputSize="md"
                className="bg-surface-base text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={selectedTagKeys.length === 0}
                  onClick={() => setSelectedTagKeys([])}
                  className={cn(
                    "w-fit px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                      selectedTagKeys.length === 0
                        ? "bg-content-base text-surface-base border-content-base font-semibold"
                      : "bg-surface-base text-content-muted border-border-base hover:border-border-strong hover:bg-surface-muted",
                  )}
                >
                  {listText.filters.allTags}
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasActiveSidebarFilters}
                  className="w-fit justify-center text-content-muted hover:bg-surface-subtle hover:text-content-base border-border-base text-xs font-semibold disabled:cursor-default disabled:opacity-40"
                  onClick={() => {
                    setStatusFilter("all");
                    setSelectedTagKeys([]);
                    setTagSearchQuery("");
                    setKeywordSearch("");
                  }}
                >
                  {listText.filters.clear}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 pb-2 space-y-5 custom-scrollbar">
              {visibleTagGroups.length === 0 ? (
                <p className="text-xs text-content-subtle py-4 text-center">{listText.filters.noTagsFound}</p>
              ) : (
                visibleTagGroups.map((group) => (
                  <div key={group.id} className="space-y-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-content-subtle">{group.label}</p>
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      {group.tags.map((tag) => {
                        const tagKey = makeCampTagKey(group.id, tag);
                        const isSelected = selectedTagKeys.includes(tagKey);

                        return (
                          <button
                            key={tagKey}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => {
                              setSelectedTagKeys((prev) => (
                                prev.includes(tagKey)
                                  ? prev.filter((value) => value !== tagKey)
                                  : [...prev, tagKey]
                              ));
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-md text-xs transition-all duration-200 border",
                              isSelected
                                ? "bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                                : "bg-surface-base text-content-muted border-border-base hover:border-border-strong hover:bg-surface-muted",
                            )}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </aside>

      <main className="flex-1 w-full min-w-0">
        <div className="space-y-6">
          {notice !== null && (
            <Alert variant={notice.variant} title={notice.title} className="!border !border-border-base/60 !shadow-sm !rounded-xl !bg-surface-base/80 backdrop-blur-sm ring-1 ring-white/50 !p-4 !text-content-muted !text-sm !font-normal">
              {notice.description}
            </Alert>
          )}

          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <p className="text-sm font-medium text-content-subtle whitespace-nowrap">
              {listText.resultsFound.replace("{count}", String(filteredTeams.length))}
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


          {isWizardOpen && (
            <CampWizardModal
              isOpen={isWizardOpen}
              onClose={() => setIsWizardOpen(false)}
              profile={profile}
              onProfileUpdate={(newProfile) => {
                setProfile(newProfile);
                setNotice({
                  variant: "success",
                  title: dict.campForm.createProfileSuccessTitle,
                  description: dict.campForm.createProfileSuccessDesc,
                });
              }}
              onSubmit={handleWizardSubmit}
              hackathons={hackathons}
              initialHackathonSlug={filterHackathonSlug}
            />
          )}

          
          {filteredTeams.length === 0 ? (
            <EmptyState
              title={hasActiveSidebarFilters ? listText.emptyFilteredTitle : dict.appPages.campEmpty}
              description={hasActiveSidebarFilters ? listText.emptyFilteredDescription : dict.appPages.campEmptyDesc}
            />
          ) : viewMode === "table" ? (
            <DataTable>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "teamName" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("teamName")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.teamName} {renderSortIcon("teamName")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "owner" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("owner")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.owner} {renderSortIcon("owner")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "hackathon" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("hackathon")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.hackathon} {renderSortIcon("hackathon")}
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
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "lookingFor" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("lookingFor")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.lookingFor} {renderSortIcon("lookingFor")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={cn("cursor-pointer group hover:bg-surface-subtle/60 transition-colors select-none", sortField === "createdAt" && "text-content-base bg-surface-muted")}
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      {listText.tableColumns.createdAt} {renderSortIcon("createdAt")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => {
                  const hackathonTitle = team.hackathonSlug
                    ? hackathonTitleBySlug.get(team.hackathonSlug) ?? listText.hackathonLabel
                    : "-";
                  return (
                    <TableRow key={team.teamCode}>
                      <TableCell className="font-semibold text-content-base">{team.name}</TableCell>
                      <TableCell>{team.ownerNicknameSnapshot ?? "-"}</TableCell>
                      <TableCell>{hackathonTitle}</TableCell>
                      <TableCell>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", team.isOpen ? "bg-blue-50 text-blue-700" : "bg-surface-muted text-content-subtle")}>
                          {team.isOpen ? listText.statusOpen : listText.statusClosed}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {team.lookingFor.slice(0, 2).map((role) => (
                            <span key={role} className="bg-surface-subtle text-content-muted px-1.5 py-0.5 text-[10px] rounded">{role}</span>
                          ))}
                          {team.lookingFor.length > 2 && <span className="bg-surface-muted text-content-subtle px-1.5 py-0.5 text-[10px] rounded">+{team.lookingFor.length - 2}</span>}
                        </div>
                      </TableCell>
                      <TableCell>{dateFormatter.format(new Date(team.createdAt))}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </DataTable>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredTeams.map((team) => {
                const hackathonTitle = team.hackathonSlug
                  ? hackathonTitleBySlug.get(team.hackathonSlug) ?? listText.hackathonLabel
                  : undefined;

                return (
                  <Card key={team.teamCode} className="h-full flex flex-col group border border-border-base/60 shadow-sm hover:shadow-lg hover:shadow-primary-base/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-surface-base overflow-hidden">
                    <CardHeader className="space-y-3 bg-surface-muted/50 border-b border-border-muted pb-4 px-5 pt-5 transition-colors duration-300">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <CardTitle className="text-lg font-bold tracking-tight text-content-base group-hover:text-primary-base transition-colors line-clamp-2">{team.name}</CardTitle>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide border whitespace-nowrap",
                            team.isOpen
                              ? "bg-primary-subtle text-primary-base border-primary-base/20"
                              : "bg-surface-muted text-content-subtle border-border-base",
                          )}
                        >
                          {team.isOpen ? listText.statusOpen : listText.statusClosed}
                        </span>
                      </div>
                      {team.ownerNicknameSnapshot !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-surface-subtle border border-border-strong flex items-center justify-center">
                            <span className="text-xs font-bold text-content-muted">{team.ownerNicknameSnapshot.charAt(0).toUpperCase()}</span>
                          </div>
                          <p className="text-sm font-medium text-content-muted">
                            <span className="text-content-base font-semibold">{team.ownerNicknameSnapshot}</span>
                          </p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4 p-5 flex-1 flex flex-col">
                      <p className="text-sm leading-relaxed text-content-muted flex-1">{team.intro}</p>

                      <div className="mt-4 flex flex-col justify-end space-y-3 border-t border-border-muted pt-4 text-sm">
                        {team.hackathonSlug !== undefined && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <span className="font-semibold text-content-subtle">{listText.hackathonLabel}</span>
                            <span className="text-left sm:text-right font-semibold text-content-base max-w-full sm:max-w-[150px] line-clamp-2">{hackathonTitle}</span>
                          </div>
                        )}

                        {team.lookingFor.length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-border-muted">
                            <span className="font-semibold text-content-subtle block">{listText.lookingForLabel}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {team.lookingFor.map((role) => (
                                <span
                                  key={`${team.teamCode}-looking-for-${role}`}
                                  className="bg-surface-subtle text-content-muted px-2 py-0.5 text-[11px] font-semibold rounded"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {(team.teamStyle ?? []).length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-border-muted">
                            <span className="font-semibold text-content-subtle block">{listText.teamStyleLabel}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(team.teamStyle ?? []).map((tag) => (
                                <span
                                  key={`${team.teamCode}-team-style-${tag}`}
                                  className="bg-primary-subtle text-primary-base px-2 py-0.5 text-[11px] font-semibold rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border-muted">
                          <span className="font-semibold text-content-subtle">{listText.createdAtLabel}</span>
                          <span className="text-right font-medium text-content-subtle text-xs">
                            {dateFormatter.format(new Date(team.createdAt))}
                          </span>
                        </div>

                        {team.contact.url.length > 0 && (
                          <div className="pt-2">
                            <a
                              href={team.contact.url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full font-semibold text-primary-base hover:text-primary-hover transition-colors flex items-center justify-center gap-1.5 bg-primary-subtle hover:bg-primary-base/20 px-3 py-2 rounded-lg"
                            >
                              {listText.contactLink}
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                <title>{listText.contactLink}</title>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
