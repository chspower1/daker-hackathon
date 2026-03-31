"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Badge } from "@/components/design-system/primitives/Badge";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { Input } from "@/components/design-system/primitives/Input";
import { Textarea } from "@/components/design-system/primitives/Textarea";
import {
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/design-system/primitives/DataTable";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { ErrorState } from "@/components/design-system/patterns/ErrorState";
import { FormField } from "@/components/design-system/patterns/FormField";
import { KeyValueList } from "@/components/design-system/patterns/KeyValueList";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
import { createLocalSubmissionId } from "@/lib/ids/local";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { createLocalProfile, getLocalProfile, saveLocalProfile } from "@/lib/profile/localProfile";
import { storageChangeEventName, type StorageChangeDetail } from "@/lib/storage/events";
import { storageKeys } from "@/lib/storage/keys";
import { findSeedHackathonDetail, findSeedHackathonSummary } from "@/lib/data/hackathons";
import { listSeedTeamPostsByHackathon } from "@/lib/data/teams";
import { findSeedLeaderboard } from "@/lib/data/leaderboards";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import { readLeaderboards, writeLeaderboards } from "@/lib/storage/entities/leaderboards";
import { readSubmissions, writeSubmissions } from "@/lib/storage/entities/submissions";
import { readTeams } from "@/lib/storage/entities/teams";
import type {
  HackathonDetail,
  HackathonSummary,
  Leaderboard,
  LeaderboardEntry,
  LocalProfile,
  SubmissionRecord,
  TeamPost,
} from "@/types";

const sectionIds = ["overview", "info", "eval", "schedule", "prize", "teams", "submit", "leaderboard"] as const;

// Sticky-header-aware scroll-spy threshold.
// Sections use `scroll-mt-32` (8rem = 128px) for anchor jumps; we reuse the same offset
// so the "active" section is the one whose top has crossed just below the sticky header.
const SCROLL_SPY_HEADER_THRESHOLD_PX = 128;
const SCROLL_SPY_BOTTOM_GUARD_PX = 4;

type SectionId = (typeof sectionIds)[number];

type Feedback = { message: string; variant: "success" | "danger" } | null;

function getTeamStatusVariant(isOpen: boolean) {
  return isOpen ? "success" as const : "default" as const;
}

function getSubmissionFields(detail: HackathonDetail | null) {
  if (!detail?.sections.submit?.submissionItems) {
    return [];
  }
  return detail.sections.submit.submissionItems.map((item) => {
    if (typeof item === "string") {
      return { key: item, title: item, format: "" };
    }
    return item;
  });
}

function getDerivedLeaderboardArtifacts(artifacts: Record<string, string>): LeaderboardEntry["artifacts"] {
  const result: LeaderboardEntry["artifacts"] = {};

  const webUrl = artifacts.webUrl || artifacts.githubUrl || artifacts.repoUrl;
  if (webUrl) {
    result.webUrl = webUrl;
  }

  const pdfUrl = artifacts.pdfUrl || artifacts.deckUrl;
  if (pdfUrl) {
    result.pdfUrl = pdfUrl;
  }

  const planTitle = artifacts.planTitle || artifacts.projectTitle;
  if (planTitle) {
    result.planTitle = planTitle;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function getSortedLeaderboardEntries(entries: LeaderboardEntry[]) {
  return [...entries].sort((left, right) => {
    const leftSubmitted = left.status === "submitted" || left.submittedAt !== undefined;
    const rightSubmitted = right.status === "submitted" || right.submittedAt !== undefined;

    if (leftSubmitted !== rightSubmitted) {
      return leftSubmitted ? -1 : 1;
    }

    if (left.rank !== undefined && right.rank !== undefined) {
      return left.rank - right.rank;
    }

    if (left.rank !== undefined) {
      return -1;
    }

    if (right.rank !== undefined) {
      return 1;
    }

    if (left.score !== undefined && right.score !== undefined && left.score !== right.score) {
      return right.score - left.score;
    }

    const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
    const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;

    return rightTime - leftTime;
  });
}

function SectionBlock({
  children,
  id,
  sectionRef,
  title,
}: {
  children: React.ReactNode;
  id: SectionId;
  sectionRef?: (node: HTMLElement | null) => void;
  title: string;
}) {
  return (
    <section id={id} ref={sectionRef} className="scroll-mt-32 space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-border-base pb-4">
        <h2 className="text-xl font-bold tracking-tight text-content-base">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function HackathonDetailContent({ slug }: { slug: string }) {
  const { dict, locale } = useI18n();
  const [detail, setDetail] = useState<HackathonDetail | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [summary, setSummary] = useState<HackathonSummary | null>(null);
  const [teams, setTeams] = useState<TeamPost[]>([]);

  // Scroll-spy seam (future tasks):
  // - Active section is computed using a "below sticky header" threshold.
  // - URL hash updates remain click-only via the existing <a href="#..."> behavior.
  // - We do NOT update location.hash on scroll (no scroll-driven hash sync).
  // - Improving initial hash handling on page load is out of scope for this task.
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(sectionIds[0]);

  const sectionElementsRef = useRef<Record<SectionId, HTMLElement | null> | null>(null);
  if (sectionElementsRef.current === null) {
    sectionElementsRef.current = Object.fromEntries(sectionIds.map((id) => [id, null])) as Record<SectionId, HTMLElement | null>;
  }

  const tocContainerRef = useRef<HTMLElement>(null);
  const tocItemsRef = useRef<Record<SectionId, HTMLAnchorElement | null> | null>(null);
  if (tocItemsRef.current === null) {
    tocItemsRef.current = Object.fromEntries(sectionIds.map((id) => [id, null])) as Record<SectionId, HTMLAnchorElement | null>;
  }

  const sectionRefCallbacks = useMemo(() => {
    const callbacks = {} as Record<SectionId, (node: HTMLElement | null) => void>;
    for (const id of sectionIds) {
      callbacks[id] = (node) => {
        if (sectionElementsRef.current === null) {
          return;
        }
        sectionElementsRef.current[id] = node;
      };
    }
    return callbacks;
  }, []);

  useEffect(() => {
    if (isLoading || hasError || (summary === null && detail === null)) {
      return;
    }

    // Scroll-spy rule (deterministic, exactly one active):
    // - Let threshold = stickyHeaderBottomY (constant px below viewport top).
    // - Pick the *last* section whose `getBoundingClientRect().top <= threshold`.
    // - If none match (top-of-page), fall back to the first section (overview).
    // - If near bottom of page, force the last section (leaderboard).
    // This updates `activeSectionId` ONLY (no hash/history mutation).

    let rafId = 0;

    const computeActiveSectionId = () => {
      const sectionElements = sectionElementsRef.current;
      if (sectionElements === null) {
        return;
      }

      const hasAnySection = sectionIds.some((id) => sectionElements[id] !== null);
      if (!hasAnySection) {
        const firstId = sectionIds[0];
        setActiveSectionId((prev) => (prev === firstId ? prev : firstId));
        return;
      }

      const doc = document.documentElement;
      const isNearBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - SCROLL_SPY_BOTTOM_GUARD_PX;
      if (isNearBottom) {
        const lastId = sectionIds[sectionIds.length - 1];
        setActiveSectionId((prev) => (prev === lastId ? prev : lastId));
        return;
      }

      const thresholdPx = SCROLL_SPY_HEADER_THRESHOLD_PX;
      let nextActive: SectionId | null = null;

      for (const id of sectionIds) {
        const el = sectionElements[id];
        if (!el) {
          continue;
        }
        const top = el.getBoundingClientRect().top;
        if (top <= thresholdPx + 1) {
          nextActive = id;
        }
      }

      const resolvedActive = nextActive ?? sectionIds[0];
      setActiveSectionId((prev) => (prev === resolvedActive ? prev : resolvedActive));
    };

    const scheduleCompute = () => {
      if (rafId !== 0) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        computeActiveSectionId();
      });
    };

    window.addEventListener("scroll", scheduleCompute, { passive: true });
    window.addEventListener("resize", scheduleCompute);
    scheduleCompute();
    window.requestAnimationFrame(scheduleCompute);

    return () => {
      window.removeEventListener("scroll", scheduleCompute);
      window.removeEventListener("resize", scheduleCompute);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [detail, hasError, isLoading, summary]);

  useEffect(() => {
    const container = tocContainerRef.current;
    const itemsMap = tocItemsRef.current;

    if (!container || !itemsMap || !activeSectionId) {
      return;
    }

    if (window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }

    const activeItem = itemsMap[activeSectionId];
    if (!activeItem) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const absoluteOffsetLeft = container.scrollLeft + (itemRect.left - containerRect.left);
    const scrollTarget = absoluteOffsetLeft - container.clientWidth / 2 + activeItem.clientWidth / 2;

    container.scrollTo({
      left: scrollTarget,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }, [activeSectionId]);

  const pageTitle = detail?.title || summary?.title || dict.appPages.hackathonDetailTitle;
  const pageDescription = detail?.sections.overview?.summary || dict.appPages.hackathonDetailDesc;

  useDocumentMetadata({
    title: `${pageTitle} - ${dict.metadata.title}`,
    description: pageDescription,
  });

  useEffect(() => {
    try {
      const hackathonResult = readHackathons();
      const nextTeams = readTeams().value.filter((team) => team.hackathonSlug === slug);

      setSummary(hackathonResult.value.find((item) => item.slug === slug) || findSeedHackathonSummary(slug) || null);
      setDetail(findSeedHackathonDetail(slug) || null);
      setTeams(
        [...(nextTeams.length > 0 ? nextTeams : listSeedTeamPostsByHackathon(slug))]
          .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      );
      setLeaderboard(readLeaderboards().value.find((item) => item.hackathonSlug === slug) || findSeedLeaderboard(slug) || null);
      setSubmissions(readSubmissions().value.filter((item) => item.hackathonSlug === slug));
      setProfile(getLocalProfile());
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<StorageChangeDetail>;
      if (customEvent.detail.key === storageKeys.localProfile) {
        setProfile(getLocalProfile());
      }
    };

    const handleNativeStorage = (e: StorageEvent) => {
      if (e.key === storageKeys.localProfile) {
        setProfile(getLocalProfile());
      }
    };

    window.addEventListener(storageChangeEventName, handleStorageChange as EventListener);
    window.addEventListener('storage', handleNativeStorage);

    return () => {
      window.removeEventListener(storageChangeEventName, handleStorageChange as EventListener);
      window.removeEventListener('storage', handleNativeStorage);
    };
  }, []);

  const languageTag = toLanguageTag(locale);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(languageTag, { dateStyle: "medium", timeStyle: "short" }),
    [languageTag]
  );

  const submissionFields = useMemo(() => getSubmissionFields(detail), [detail]);

  const activeSubmission = useMemo(() => {
    if (profile === null) {
      return null;
    }

    return [...submissions]
      .filter((item) => item.profileId === profile.id)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())[0] || null;
  }, [profile, submissions]);

  const leaderboardEntries = useMemo(
    () => getSortedLeaderboardEntries(leaderboard?.entries ?? []),
    [leaderboard]
  );

  const formatDateTime = (value?: string) => {
    if (value === undefined) {
      return dict.hackathonDetail.labels.noValue;
    }

    return dateFormatter.format(new Date(value));
  };

  const formatNumber = (value?: number) => {
    if (value === undefined) {
      return dict.hackathonDetail.labels.noValue;
    }

    return value.toLocaleString(languageTag);
  };

  const handleProfileCreate = (nickname: string) => {
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length === 0) {
      setFeedback({
        message: dict.hackathonDetail.messages.profileCreateFailed,
        variant: "danger",
      });
      return;
    }

    const nextProfile = createLocalProfile(trimmedNickname);

    if (!saveLocalProfile(nextProfile)) {
      setFeedback({
        message: dict.hackathonDetail.messages.profileCreateFailed,
        variant: "danger",
      });
      return;
    }

    setProfile(nextProfile);
    setFeedback({
      message: dict.hackathonDetail.messages.profileReady,
      variant: "success",
    });
  };

  const handleSubmission = (action: "draft" | "submit", formData: FormData) => {
    if (profile === null) {
      return;
    }

    const teamName = String(formData.get("teamName")).trim();
    const notesValue = String(formData.get("notes")).trim();
    const now = new Date();
    const nowIso = now.toISOString();
    const previousSubmissions = readSubmissions().value;

    const artifacts = submissionFields.reduce<Record<string, string>>((result, field) => {
      const value = String(formData.get(`artifact-${field.key}`)).trim();

      if (value.length > 0) {
        result[field.key] = value;
      }

      return result;
    }, {});

    const nextSubmission: SubmissionRecord = {
      artifacts,
      hackathonSlug: slug,
      id: activeSubmission?.id || createLocalSubmissionId(now),
      notes: notesValue.length > 0 ? notesValue : undefined,
      profileId: profile.id,
      profileNicknameSnapshot: profile.nickname,
      status: action === "draft" ? "draft" : "submitted",
      submittedAt: action === "submit" ? nowIso : undefined,
      teamName,
      updatedAt: nowIso,
    };

    const nextSubmissions = [
      ...previousSubmissions.filter((item) => item.id !== nextSubmission.id),
      nextSubmission,
    ];

    if (!writeSubmissions(nextSubmissions)) {
      setFeedback({
        message: dict.hackathonDetail.messages.saveFailed,
        variant: "danger",
      });
      return;
    }

    if (action === "submit") {
      const previousLeaderboards = readLeaderboards().value;
      const currentLeaderboard = previousLeaderboards.find((item) => item.hackathonSlug === slug);
      const existingEntry = currentLeaderboard?.entries.find((item) => item.teamName === teamName);
      const nextEntry: LeaderboardEntry = {
        ...existingEntry,
        artifacts: getDerivedLeaderboardArtifacts(artifacts) || existingEntry?.artifacts,
        status: "submitted",
        submittedAt: nowIso,
        teamName,
      };
      const nextLeaderboard: Leaderboard = {
        entries: currentLeaderboard === undefined
          ? [nextEntry]
          : [
              ...currentLeaderboard.entries.filter((item) => item.teamName !== teamName),
              nextEntry,
            ],
        hackathonSlug: slug,
        updatedAt: nowIso,
      };
      const otherLeaderboards = previousLeaderboards.filter((item) => item.hackathonSlug !== slug);

      if (!writeLeaderboards([...otherLeaderboards, nextLeaderboard])) {
        const rollbackSucceeded = writeSubmissions(previousSubmissions);
        const effectiveSubmissions = rollbackSucceeded ? previousSubmissions : readSubmissions().value;

        setSubmissions(effectiveSubmissions.filter((item) => item.hackathonSlug === slug));
        setFeedback({
          message: dict.hackathonDetail.messages.submitFailed,
          variant: "danger",
        });
        return;
      }

      setLeaderboard(nextLeaderboard);
      setFeedback({
        message: dict.hackathonDetail.messages.submitted,
        variant: "success",
      });
    } else {
      setFeedback({
        message: dict.hackathonDetail.messages.draftSaved,
        variant: "success",
      });
    }

    setSubmissions(nextSubmissions.filter((item) => item.hackathonSlug === slug));
  };

  if (isLoading) {
    return <LoadingState label={dict.appPages.loadingLabel} />;
  }

  if (hasError) {
    return (
      <ErrorState
        title={dict.appPages.errorTitle}
        message={dict.appPages.errorDesc}
      />
    );
  }

  if (summary === null && detail === null) {
    return (
      <EmptyState
        title={dict.appPages.hackathonDetailEmpty}
        description={dict.appPages.hackathonDetailEmptyDesc}
      />
    );
  }

  const sectionText = dict.hackathonDetail.sections;
  const labelText = dict.hackathonDetail.labels;
  const statusText = dict.hackathonDetail.status;
  const emptyText = dict.hackathonDetail.empty;
  const leaderboardUpdatedAt = leaderboard?.updatedAt ? formatDateTime(leaderboard.updatedAt) : null;

  const tocSections = sectionIds.map((id) => ({ id, label: sectionText[id] || id }));

  return (
    <div className="space-y-10 pb-20">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={summary ? (
          <Badge variant="default" className="px-3 py-1 text-sm font-medium shadow-sm">
            {dict.hackathonList.status[summary.status] || summary.status}
          </Badge>
        ) : undefined}
      />

      {feedback ? (
        <Alert variant={feedback.variant} title={feedback.variant === "success" ? pageTitle : dict.appPages.errorTitle}>
          {feedback.message}
        </Alert>
      ) : null}

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <aside className="sticky top-32 z-20 w-full shrink-0 md:top-24 lg:w-72">
          <nav
            ref={tocContainerRef}
            data-active-section-id={activeSectionId}
            className="overflow-x-auto rounded-xl border border-border-base bg-surface-base/80 p-1.5 shadow-sm backdrop-blur-md lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
          >
            <div className="flex min-w-max gap-1 px-1 lg:min-w-0 lg:flex-col">
              {tocSections.map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <a
                    key={section.id}
                    ref={(node) => {
                      if (tocItemsRef.current) {
                        tocItemsRef.current[section.id] = node;
                      }
                    }}
                    href={`#${section.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => {
                      if (!isActive) {
                        setActiveSectionId(section.id);
                      }
                    }}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 lg:whitespace-normal ${
                      isActive
                        ? "bg-surface-subtle font-semibold text-content-base"
                        : "font-medium text-content-muted hover:bg-surface-subtle hover:text-content-base"
                    }`}
                  >
                    {section.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          <SectionBlock id="overview" title={sectionText.overview} sectionRef={sectionRefCallbacks.overview}>
            {detail?.sections.overview ? (
              <Card className="rounded-2xl border border-border-base shadow-sm">
                <CardContent className="space-y-5 pt-6">
                  <p className="rounded-r-lg border-l-4 border-blue-500 bg-surface-muted py-1 pl-4 text-sm leading-relaxed text-content-muted">
                    {detail.sections.overview.summary || labelText.noValue}
                  </p>
                  <KeyValueList
                    items={[
                      {
                        label: labelText.allowSolo,
                        value: detail.sections.overview.teamPolicy?.allowSolo === undefined
                          ? labelText.noValue
                          : detail.sections.overview.teamPolicy.allowSolo
                            ? labelText.allowSolo
                            : labelText.noSolo,
                      },
                      {
                        label: labelText.maxTeamSize,
                        value: detail.sections.overview.teamPolicy?.maxTeamSize || labelText.noValue,
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={emptyText.sectionDescription} />
            )}
          </SectionBlock>

          <SectionBlock id="info" title={sectionText.info} sectionRef={sectionRefCallbacks.info}>
            {detail?.sections.info ? (
              <Card className="rounded-2xl border border-border-base shadow-sm">
                <CardContent className="space-y-6 pt-6">
                  {detail.sections.info.notice && detail.sections.info.notice.length > 0 ? (
                    <ul className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 p-5 text-sm leading-relaxed text-content-muted shadow-sm">
                      {detail.sections.info.notice.map((notice) => (
                        <li key={notice} className="flex items-start gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                          <span>{notice}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="flex flex-wrap gap-4">
                    {detail.sections.info.links?.rules ? (
                      <a
                        href={detail.sections.info.links.rules}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-border-base bg-surface-base px-6 py-2.5 text-sm font-semibold text-content-muted shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
                      >
                        {labelText.rules} →
                      </a>
                    ) : null}
                    {detail.sections.info.links?.faq ? (
                      <a
                        href={detail.sections.info.links.faq}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-border-base bg-surface-base px-6 py-2.5 text-sm font-semibold text-content-muted shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
                      >
                        {labelText.faq} →
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={emptyText.sectionDescription} />
            )}
          </SectionBlock>

          <SectionBlock id="eval" title={sectionText.eval} sectionRef={sectionRefCallbacks.eval}>
            {detail?.sections.eval ? (
              <Card className="rounded-2xl border border-border-base shadow-sm">
                <CardContent className="space-y-8 pt-8">
                  <KeyValueList
                    items={[
                      {
                        label: labelText.metricName,
                        value: detail.sections.eval.metricName || labelText.noValue,
                      },
                      {
                        label: labelText.description,
                        value: detail.sections.eval.description || labelText.noValue,
                      },
                      {
                        label: labelText.scoreSource,
                        value: detail.sections.eval.scoreSource || labelText.noValue,
                      },
                    ]}
                  />

                  {detail.sections.eval.scoreDisplay?.breakdown && detail.sections.eval.scoreDisplay.breakdown.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="inline-block border-b border-border-base pb-2 text-lg font-semibold text-content-base">
                        {labelText.breakdown}
                      </h3>
                      <div className="space-y-3">
                        {detail.sections.eval.scoreDisplay.breakdown.map((item) => (
                          <div key={item.key} className="flex items-center justify-between rounded-xl border border-border-base bg-surface-base px-5 py-3 text-sm shadow-sm transition-colors hover:border-border-strong">
                            <span className="font-medium text-content-muted">{item.label}</span>
                            <span className="font-bold text-content-base">{item.weightPercent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {detail.sections.eval.limits ? (
                    <div className="flex flex-wrap gap-3 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/20 p-5 shadow-sm">
                      {detail.sections.eval.limits.maxRuntimeSec ? (
                        <Badge variant="default" className="border border-border-base bg-surface-base text-sm font-medium text-content-muted shadow-sm">
                          {labelText.maxRuntime}: {detail.sections.eval.limits.maxRuntimeSec}{labelText.runtimeUnit}
                        </Badge>
                      ) : null}
                      {detail.sections.eval.limits.maxSubmissionsPerDay ? (
                        <Badge variant="default" className="border border-border-base bg-surface-base text-sm font-medium text-content-muted shadow-sm">
                          {labelText.maxSubmissions}: {detail.sections.eval.limits.maxSubmissionsPerDay}
                        </Badge>
                      ) : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={emptyText.sectionDescription} />
            )}
          </SectionBlock>

          <SectionBlock id="schedule" title={sectionText.schedule} sectionRef={sectionRefCallbacks.schedule}>
            {detail?.sections.schedule?.milestones && detail.sections.schedule.milestones.length > 0 ? (
              <Card className="rounded-2xl border border-border-base shadow-sm">
                <CardContent className="space-y-6 pt-6">
                  {detail.sections.schedule.timezone ? (
                    <div className="inline-block rounded-full border border-border-base bg-surface-muted px-3 py-1 text-sm font-medium text-content-muted shadow-sm">
                      {labelText.timezone}: {detail.sections.schedule.timezone}
                    </div>
                  ) : null}
                  <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-px before:-translate-x-px before:bg-border-strong md:before:mx-auto md:before:translate-x-0">
                    {[...detail.sections.schedule.milestones]
                      .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime())
                      .map((milestone) => (
                        <div key={`${milestone.name}-${milestone.at}`} className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-base bg-surface-base shadow-sm transition-transform group-hover:scale-110 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          </div>
                          <div className="w-[calc(100%-3.5rem)] rounded-2xl border border-border-base bg-surface-base p-5 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md md:w-[calc(50%-2.5rem)]">
                            <div className="flex flex-col gap-1.5">
                              <h3 className="text-lg font-semibold text-content-base">{milestone.name}</h3>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{formatDateTime(milestone.at)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={emptyText.sectionDescription} />
            )}
          </SectionBlock>

          <SectionBlock id="prize" title={sectionText.prize} sectionRef={sectionRefCallbacks.prize}>
            {detail?.sections.prize?.items && detail.sections.prize.items.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {detail.sections.prize.items.map((item, idx) => (
                  <Card
                    key={`${item.place}-${item.amountKRW}`}
                    className={idx === 0
                      ? "rounded-2xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/20 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                      : idx === 1
                        ? "rounded-2xl border border-border-base bg-surface-muted/50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        : "rounded-2xl border border-orange-200 bg-orange-50/50 dark:border-orange-900/50 dark:bg-orange-900/20 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"}
                  >
                    <CardHeader className="border-b border-border-base/60 bg-transparent pb-4">
                      <CardTitle className="text-2xl font-bold text-content-base">{item.place}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-3xl font-bold tracking-tight text-content-base lg:text-4xl">
                        {labelText.prizeCurrency} <br />
                        <span className="text-blue-600 dark:text-blue-400">{item.amountKRW.toLocaleString(languageTag)}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={labelText.emptyPrize} />
            )}
          </SectionBlock>

          <SectionBlock id="teams" title={sectionText.teams} sectionRef={sectionRefCallbacks.teams}>
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-border-base bg-surface-muted p-6 shadow-sm">
              <p className="text-lg font-semibold text-content-base">
                {labelText.teamCount.replace("{count}", teams.length.toLocaleString(languageTag))}
              </p>
              <Link
                href={`/camp?hackathon=${encodeURIComponent(slug)}`}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
              >
                {labelText.goToCamp} →
              </Link>
            </div>

            {teams.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {teams.map((team) => (
                  <Card key={team.teamCode} className="overflow-hidden rounded-2xl border border-border-base shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="space-y-3 border-b border-border-muted bg-surface-muted/50 px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg font-semibold text-content-base">{team.name}</CardTitle>
                        <Badge variant={getTeamStatusVariant(team.isOpen)} className="px-2.5 py-0.5 text-xs font-medium">
                          {team.isOpen ? statusText.recruiting : statusText.closed}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-content-muted">{team.intro}</p>
                    </CardHeader>
                    <CardContent className="space-y-5 bg-surface-base p-5">
                      <KeyValueList
                        items={[
                          {
                            label: labelText.memberCount,
                            value: team.memberCount || labelText.noValue,
                          },
                          {
                            label: labelText.createdAt,
                            value: formatDateTime(team.createdAt),
                          },
                        ]}
                      />

                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-content-subtle">{labelText.lookingFor}</p>
                        <div className="flex flex-wrap gap-2">
                          {team.lookingFor.length > 0 ? team.lookingFor.map((role) => (
                            <span key={role} className="rounded-md border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                              {role}
                            </span>
                          )) : (
                            <span className="rounded-md border border-border-base bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-content-subtle">
                              {labelText.noValue}
                            </span>
                          )}
                        </div>
                      </div>

                      <a
                        href={team.contact.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex w-full justify-center rounded-xl border border-border-base bg-surface-base py-2.5 text-sm font-semibold text-content-muted shadow-sm transition-all hover:bg-surface-muted hover:text-content-base"
                      >
                        {labelText.contact} →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={labelText.emptyTeams} />
            )}
          </SectionBlock>

          <SectionBlock id="submit" title={sectionText.submit} sectionRef={sectionRefCallbacks.submit}>
            {detail?.sections.submit ? (
              profile === null ? (
                <Card className="rounded-2xl border border-border-base shadow-sm">
                  <CardContent className="space-y-8 pt-8">
                    <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/20 p-5 shadow-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">👋</div>
                      <div>
                        <p className="text-lg font-bold text-content-base">{labelText.profileRequired}</p>
                        <p className="mt-1 text-sm text-content-subtle">{labelText.createProfileDesc}</p>
                      </div>
                    </div>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        handleProfileCreate(String(formData.get("nickname")));
                      }}
                      className="flex flex-col gap-5 rounded-2xl border border-border-base bg-surface-base p-6 shadow-sm sm:flex-row sm:items-end"
                    >
                      <div className="flex-1">
                        <FormField label={labelText.nickname} required>
                          <Input
                            name="nickname"
                            placeholder={dict.hackathonDetail.placeholders.nickname || labelText.nickname}
                            required
                          />
                        </FormField>
                      </div>
                      <Button type="submit" variant="primary" className="h-11 w-full px-6 shadow-sm sm:w-auto">
                        {labelText.createProfile}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-border-base shadow-sm">
                  <CardContent className="space-y-8 pt-8">
                    <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/20 p-5 shadow-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">👤</div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-content-subtle">{labelText.currentProfile}</p>
                        <p className="text-xl font-bold text-content-base">{profile.nickname}</p>
                      </div>
                    </div>

                    {detail.sections.submit.guide && detail.sections.submit.guide.length > 0 ? (
                      <div className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 p-6 shadow-sm">
                        <h3 className="mb-2 text-lg font-semibold text-amber-900 dark:text-amber-200">{labelText.submitGuide}</h3>
                        <ul className="space-y-3 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                          {detail.sections.submit.guide.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <form
                      key={`${activeSubmission?.id}-${activeSubmission?.updatedAt}`}
                      onSubmit={(event) => {
                        event.preventDefault();
                        const submitter = event.nativeEvent.submitter;
                        const actionValue = submitter instanceof HTMLButtonElement ? submitter.value : undefined;
                        const formData = new FormData(event.currentTarget);
                        const action = actionValue === "draft" ? "draft" : "submit";
                        handleSubmission(action, formData);
                      }}
                      className="space-y-6 rounded-2xl border border-border-base bg-surface-base p-6 shadow-sm"
                    >
                      <FormField label={labelText.teamName} required>
                        <Input
                          name="teamName"
                          defaultValue={activeSubmission?.teamName}
                          placeholder={dict.hackathonDetail.placeholders.teamName || labelText.teamName}
                          required
                        />
                      </FormField>

                      {submissionFields.map((field) => (
                        <FormField key={field.key} label={`${field.title} (${field.key})`} description={field.format}>
                          <Input
                            name={`artifact-${field.key}`}
                            defaultValue={activeSubmission?.artifacts[field.key]}
                            placeholder={field.format}
                          />
                        </FormField>
                      ))}

                      <FormField label={labelText.notes}>
                        <Textarea
                          name="notes"
                          defaultValue={activeSubmission?.notes}
                          placeholder={dict.hackathonDetail.placeholders.notes || labelText.notes}
                        />
                      </FormField>

                      <div className="flex flex-wrap gap-3 border-t border-border-muted pt-6">
                        <Button type="submit" variant="outline" name="action" value="draft" className="h-11 flex-1 px-6 text-sm font-semibold md:flex-none">
                          {labelText.saveDraft}
                        </Button>
                        <Button type="submit" variant="primary" name="action" value="submit" className="h-11 flex-1 px-6 text-sm font-semibold shadow-sm md:flex-none">
                          {labelText.finalSubmit}
                        </Button>
                      </div>

                      {activeSubmission ? (
                        <div className="mt-6 flex flex-col gap-2 rounded-xl border border-border-base bg-surface-muted p-5 shadow-sm md:flex-row md:items-center md:gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-content-muted">{labelText.currentStatus}:</span>
                            <Badge variant={activeSubmission.status === "submitted" ? "success" : "default"} className="font-medium">
                              {statusText[activeSubmission.status] || activeSubmission.status}
                            </Badge>
                          </div>
                          <div className="hidden h-4 w-px bg-border-strong md:block" />
                          <div className="text-sm text-content-muted">
                            <span className="font-semibold">{labelText.lastUpdated}:</span> {formatDateTime(activeSubmission.updatedAt)}
                          </div>
                        </div>
                      ) : null}
                    </form>
                  </CardContent>
                </Card>
              )
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={emptyText.sectionDescription} />
            )}
          </SectionBlock>

          <SectionBlock id="leaderboard" title={sectionText.leaderboard} sectionRef={sectionRefCallbacks.leaderboard}>
            {leaderboardEntries.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-base shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-border-muted bg-surface-muted/50 p-6 md:flex-row md:items-center">
                  <h3 className="text-lg font-semibold text-content-base">{sectionText.leaderboard}</h3>
                  {leaderboardUpdatedAt ? (
                    <p className="rounded-md border border-border-base bg-surface-base px-2.5 py-1 text-xs font-medium text-content-subtle shadow-sm">
                      {labelText.lastUpdated}: {leaderboardUpdatedAt}
                    </p>
                  ) : null}
                </div>
                <div className="p-0">
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24 pl-6">{dict.misc.tableRank}</TableHead>
                        <TableHead>{dict.misc.tableTeam}</TableHead>
                        <TableHead>{dict.misc.tableScore}</TableHead>
                        <TableHead>{labelText.submittedAt}</TableHead>
                        <TableHead className="pr-6">{labelText.artifacts}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardEntries.map((entry, idx) => (
                        <TableRow key={`${entry.teamName}-${entry.submittedAt || entry.rank || "entry"}`} className={idx < 3 ? "bg-amber-50/30 dark:bg-amber-900/20" : ""}>
                          <TableCell className="pl-6 text-lg font-bold text-content-muted">
                            {idx === 0 ? "🏆" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : entry.rank ?? labelText.noValue}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1.5">
                              <div className="text-base font-semibold text-content-base">{entry.teamName}</div>
                              {entry.status ? (
                                <Badge variant={entry.status === "submitted" ? "success" : "default"} className="px-2 py-0 text-[10px] font-medium">
                                  {statusText[entry.status] || entry.status}
                                </Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-mono text-xl font-semibold text-blue-600 dark:text-blue-400">{formatNumber(entry.score)}</div>
                              {entry.scoreBreakdown ? (
                                <div className="mt-1 space-y-1 border-l-2 border-border-base pl-2 text-xs font-medium text-content-subtle">
                                  {Object.entries(entry.scoreBreakdown).map(([key, value]) => (
                                    <div key={key} className="flex gap-2">
                                      <span className="uppercase tracking-wider">{key}</span>
                                      <span>{formatNumber(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-content-muted">{formatDateTime(entry.submittedAt)}</TableCell>
                          <TableCell className="pr-6">
                            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
                              {entry.artifacts?.webUrl ? (
                                <a
                                  href={entry.artifacts.webUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block rounded-md border border-border-base bg-surface-base px-2.5 py-1 text-content-muted shadow-sm transition-colors hover:border-blue-200 hover:bg-surface-muted hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  {labelText.web}
                                </a>
                              ) : null}
                              {entry.artifacts?.pdfUrl ? (
                                <a
                                  href={entry.artifacts.pdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block rounded-md border border-border-base bg-surface-base px-2.5 py-1 text-content-muted shadow-sm transition-colors hover:border-blue-200 hover:bg-surface-muted hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  {labelText.pdf}
                                </a>
                              ) : null}
                              {entry.artifacts?.planTitle ? (
                                <div className="rounded-md border border-border-base bg-surface-muted px-2.5 py-1 text-content-subtle">
                                  {entry.artifacts.planTitle}
                                </div>
                              ) : null}
                              {entry.artifacts === undefined ? (
                                <span className="normal-case font-medium text-content-subtle">{labelText.noValue}</span>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                </div>
              </div>
            ) : (
              <EmptyState title={emptyText.sectionTitle} description={labelText.emptyLeaderboard} />
            )}
          </SectionBlock>
        </div>
      </div>
    </div>
  );
}
