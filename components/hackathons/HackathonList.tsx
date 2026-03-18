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
    <div className="space-y-8">
      <div className="border-4 border-content-base bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-content-subtle">
              {listText?.filters?.statusLabel || "Status"}
            </p>
            <div className="flex flex-wrap gap-3">
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

          <div className="space-y-4 lg:max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-content-subtle">
              {listText?.filters?.tagLabel || "Tags"}
            </p>
            <div className="flex flex-wrap gap-3">
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
              className="self-start mt-8 lg:mt-0 bg-red-400 hover:bg-red-500 text-white"
              variant="brutal"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredHackathons.map((hackathon) => {
            const startDate = formatDate(hackathon.period.startAt);
            const deadlineDate = formatDate(hackathon.period.submissionDeadlineAt);
            const endDate = formatDate(hackathon.period.endAt);

            return (
              <Link key={hackathon.slug} href={hackathon.links.detail} className="group block">
                <Card className="h-full overflow-hidden">
                  {hackathon.thumbnailUrl ? (
                    <div className="aspect-[16/9] overflow-hidden bg-surface-subtle border-b-4 border-content-base">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={hackathon.title}
                        className="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
                        src={hackathon.thumbnailUrl}
                      />
                    </div>
                  ) : null}

                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={getStatusBadgeVariant(hackathon.status)}>
                        {listText?.status?.[hackathon.status] || hackathon.status}
                      </Badge>
                      {'participantsCount' in hackathon && (
                        <span className="text-sm font-bold text-content-subtle">
                          {(hackathon as unknown as { participantsCount?: number }).participantsCount?.toLocaleString(languageTag)} {"participants"}
                        </span>
                      )}
                    </div>
                    <CardTitle className="group-hover:underline decoration-4 underline-offset-4 decoration-primary-base transition-all">{hackathon.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-2 text-sm font-bold text-content-base border-l-4 border-primary-base pl-3">
                      {startDate && endDate ? (
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-content-subtle">{"Period"}</span>
                          <span className="text-right">
                            {startDate} - {endDate}
                          </span>
                        </div>
                      ) : null}
                      {deadlineDate ? (
                        <div className="flex items-start justify-between gap-2 text-red-600">
                          <span>{"Deadline"}</span>
                          <span className="text-right">{deadlineDate}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {hackathon.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-content-base bg-white px-2 py-1 text-xs font-black uppercase tracking-widest text-content-base"
                        >
                          {tag}
                        </span>
                      ))}
                      {hackathon.tags.length > 3 ? (
                        <span className="border-2 border-content-base bg-surface-muted px-2 py-1 text-xs font-black uppercase text-content-subtle">
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

