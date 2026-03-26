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
import { listSeedHackathons } from "@/lib/data/hackathons";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import type { HackathonStatus, HackathonSummary } from "@/types";

const statusOptions: Array<"all" | HackathonStatus> = ["all", "upcoming", "ongoing", "ended"];

function getStatusBadgeVariant(status: HackathonStatus) {
  if (status === "ongoing") {
    return "success" as const;
  }

  if (status === "upcoming") {
    return "info" as const;
  }

  return "default" as const;
}

export function HackathonList() {
  const { dict, locale } = useI18n();
  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [tagFilter, setTagFilter] = useState("");
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

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(languageTag, { dateStyle: "medium" }),
    [languageTag]
  );

  const availableTags = useMemo(() => {
    const tags = new Set<string>();

    hackathons.forEach((hackathon) => {
      hackathon.tags.forEach((tag) => {
        tags.add(tag);
      });
    });

    return [...tags].sort((left, right) => left.localeCompare(right, languageTag));
  }, [hackathons, languageTag]);

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const statusMatches = statusFilter === "all" || hackathon.status === statusFilter;
      const tagMatches = tagFilter === "" || hackathon.tags.includes(tagFilter);

      return statusMatches && tagMatches;
    });
  }, [hackathons, statusFilter, tagFilter]);

  const listText = dict.hackathonList;

  const formatDate = (value?: string) => {
    if (value === undefined) {
      return null;
    }

    return dateFormatter.format(new Date(value));
  };

  if (isLoading) {
    return <LoadingState label={dict.appPages?.loadingLabel} />;
  }

  if (hasError) {
    return (
      <ErrorState
        title={listText?.errorTitle || dict.appPages?.errorTitle || "Unable to load this page"}
        message={listText?.errorDescription || dict.appPages?.errorDesc || "Please try again."}
      />
    );
  }

  if (hackathons.length === 0) {
    return (
      <EmptyState
        title={dict.appPages?.hackathonsEmpty || "No hackathons found"}
        description={dict.appPages?.hackathonsEmptyDesc || "There are currently no hackathons available. Check back later."}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-md p-4 lg:p-5 shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              {listText?.filters?.statusLabel || "Status"}
            </p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option;
                const label = option === "all"
                  ? listText?.filters?.allStatuses || "All statuses"
                  : listText?.status?.[option] || option;

                return (
                  <Button
                    key={option}
                    variant={isActive ? "primary" : "outline"}
                    size="sm"
                    type="button"
                    onClick={() => setStatusFilter(option)}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 lg:max-w-xl">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              {listText?.filters?.tagLabel || "Tags"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={tagFilter === "" ? "primary" : "outline"}
                size="sm"
                type="button"
                onClick={() => setTagFilter("")}
              >
                {listText?.filters?.allTags || "All tags"}
              </Button>
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  variant={tagFilter === tag ? "primary" : "outline"}
                  size="sm"
                  type="button"
                  onClick={() => setTagFilter(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {(statusFilter !== "all" || tagFilter !== "") ? (
            <Button
              className="self-start mt-6 lg:mt-0 bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-none hover:shadow-none border-none hover:-translate-y-0"
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setTagFilter("");
              }}
            >
              {listText?.filters?.clear || "Clear filters"}
            </Button>
          ) : null}
        </div>
      </div>

      {filteredHackathons.length === 0 ? (
        <EmptyState
          title={listText?.emptyFilteredTitle || "No matching hackathons"}
          description={listText?.emptyFilteredDescription || "Try a different combination of filters."}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredHackathons.map((hackathon) => {
            const startDate = formatDate(hackathon.period.startAt);
            const deadlineDate = formatDate(hackathon.period.submissionDeadlineAt);
            const endDate = formatDate(hackathon.period.endAt);

            return (
              <Link key={hackathon.slug} href={hackathon.links.detail} className="group block h-full">
                <Card className="h-full overflow-hidden hover:border-blue-200/60">
                  {hackathon.thumbnailUrl ? (
                   <div className="aspect-[16/9] overflow-hidden bg-slate-50 border-b border-slate-100">
                      {imageErrors[hackathon.slug] ? (
                        <div className="h-full w-full bg-slate-100/50 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100/50" />
                          </div>
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          alt={hackathon.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={hackathon.thumbnailUrl}
                          onError={() => {
                            setImageErrors((prev) => ({ ...prev, [hackathon.slug]: true }));
                          }}
                        />
                      )}
                    </div>
                  ) : null}

                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(hackathon.status)}>
                        {listText?.status?.[hackathon.status] || hackathon.status}
                      </Badge>
                      {'participantsCount' in hackathon && (
                        <span className="text-sm font-semibold text-slate-600">
                          {(hackathon as unknown as { participantsCount?: number }).participantsCount?.toLocaleString(languageTag)} {"participants"}
                        </span>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                      {hackathon.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2 text-sm font-medium text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      {startDate && endDate ? (
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                          <span className="text-slate-600">{"Period"}</span>
                          <span className="text-left sm:text-right text-slate-900 font-semibold text-xs sm:text-sm">
                            {startDate} - {endDate}
                          </span>
                        </div>
                      ) : null}
                      {deadlineDate ? (
                        <div className="flex flex-col gap-1 text-red-700 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                          <span className="font-semibold">{"Deadline"}</span>
                          <span className="text-left sm:text-right font-semibold text-xs sm:text-sm">{deadlineDate}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hackathon.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                           className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm transition-colors group-hover:border-blue-200 group-hover:text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {hackathon.tags.length > 3 ? (
                         <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-transparent">
                          +{hackathon.tags.length - 3}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
