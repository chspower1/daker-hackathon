"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Badge } from "@/components/design-system/primitives/Badge";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
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
import { Input } from "@/components/design-system/primitives/Input";
import { Textarea } from "@/components/design-system/primitives/Textarea";
import {
  findSeedHackathonDetail,
  findSeedHackathonSummary,
} from "@/lib/data/hackathons";
import { findSeedLeaderboard } from "@/lib/data/leaderboards";
import { listSeedTeamPostsByHackathon } from "@/lib/data/teams";
import { createLocalSubmissionId } from "@/lib/ids/local";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { createLocalProfile, getLocalProfile, saveLocalProfile } from "@/lib/profile/localProfile";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import { readLeaderboards, writeLeaderboards } from "@/lib/storage/entities/leaderboards";
import { readSubmissions, writeSubmissions } from "@/lib/storage/entities/submissions";
import { readTeams } from "@/lib/storage/entities/teams";
import type {
  HackathonDetail,
  HackathonStatus,
  HackathonSummary,
  Leaderboard,
  LeaderboardEntry,
  LocalProfile,
  SubmissionRecord,
  TeamPost,
} from "@/types";

type Feedback = {
  message: string;
  variant: "danger" | "success";
} | null;

type SubmissionField = {
  format: string;
  key: string;
  title: string;
};

const sectionIds = [
  "overview",
  "info",
  "eval",
  "schedule",
  "prize",
  "teams",
  "submit",
  "leaderboard",
] as const;

function getHackathonStatusVariant(status: HackathonStatus) {
  if (status === "ongoing") {
    return "success" as const;
  }

  if (status === "upcoming") {
    return "info" as const;
  }

  return "default" as const;
}

function getTeamStatusVariant(isOpen: boolean) {
  return isOpen ? ("success" as const) : ("default" as const);
}

function getSubmissionFields(detail: HackathonDetail | null): SubmissionField[] {
  const configuredItems = detail?.sections.submit?.submissionItems;

  if (configuredItems !== undefined && configuredItems.length > 0) {
    return configuredItems.map((item) => ({
      format: item.format,
      key: item.key,
      title: item.title,
    }));
  }

  return (detail?.sections.submit?.allowedArtifactTypes ?? []).map((type) => ({
    format: type === "pdf" ? "pdf_url" : type === "zip" ? "zip_url" : "url",
    key: type,
    title: type.toUpperCase(),
  }));
}

function getDerivedLeaderboardArtifacts(artifacts: Record<string, string>) {
  const nextArtifacts = {
    pdfUrl: artifacts.pdf,
    planTitle: artifacts.plan,
    webUrl: artifacts.web || artifacts.url,
  };

  if (Object.values(nextArtifacts).every((value) => value === undefined || value === "")) {
    return undefined;
  }

  return nextArtifacts;
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
  title,
}: {
  children: React.ReactNode;
  id: (typeof sectionIds)[number];
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-content-base">{title}</h2>
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

  const pageTitle = detail?.title || summary?.title || dict.appPages?.hackathonDetailTitle || "Hackathon Detail";
  const pageDescription = detail?.sections.overview?.summary || dict.appPages?.hackathonDetailDesc || dict.metadata.description;

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
      return dict.hackathonDetail?.labels?.noValue || "-";
    }

    return dateFormatter.format(new Date(value));
  };

  const formatNumber = (value?: number) => {
    if (value === undefined) {
      return dict.hackathonDetail?.labels?.noValue || "-";
    }

    return value.toLocaleString(languageTag);
  };

  const handleProfileCreate = (nickname: string) => {
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length === 0) {
      setFeedback({
        message: dict.hackathonDetail?.messages?.profileCreateFailed || "Unable to create a profile.",
        variant: "danger",
      });
      return;
    }

    const nextProfile = createLocalProfile(trimmedNickname);

    if (!saveLocalProfile(nextProfile)) {
      setFeedback({
        message: dict.hackathonDetail?.messages?.profileCreateFailed || "Unable to create a profile.",
        variant: "danger",
      });
      return;
    }

    setProfile(nextProfile);
    setFeedback({
      message: dict.hackathonDetail?.messages?.profileReady || "Profile ready.",
      variant: "success",
    });
  };

  const handleSubmission = (action: "draft" | "submit", formData: FormData) => {
    if (profile === null) {
      return;
    }

    const teamName = String(formData.get("teamName") || "").trim();
    const notesValue = String(formData.get("notes") || "").trim();
    const now = new Date();
    const nowIso = now.toISOString();
    const previousSubmissions = readSubmissions().value;

    const artifacts = submissionFields.reduce<Record<string, string>>((result, field) => {
      const value = String(formData.get(`artifact-${field.key}`) || "").trim();

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
        message: dict.hackathonDetail?.messages?.saveFailed || "Unable to save changes.",
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
        writeSubmissions(previousSubmissions);
        setFeedback({
          message: dict.hackathonDetail?.messages?.submitFailed || "Unable to submit your entry.",
          variant: "danger",
        });
        return;
      }

      setLeaderboard(nextLeaderboard);
      setFeedback({
        message: dict.hackathonDetail?.messages?.submitted || "Successfully submitted.",
        variant: "success",
      });
    } else {
      setFeedback({
        message: dict.hackathonDetail?.messages?.draftSaved || "Draft saved.",
        variant: "success",
      });
    }

    setSubmissions(nextSubmissions.filter((item) => item.hackathonSlug === slug));
  };

  if (isLoading) {
    return <LoadingState label={dict.appPages?.loadingLabel} />;
  }

  if (hasError) {
    return (
      <ErrorState
        title={dict.appPages?.errorTitle || "Unable to load this page"}
        message={dict.appPages?.errorDesc || "Please try again."}
      />
    );
  }

  if (summary === null && detail === null) {
    return (
      <EmptyState
        title={dict.appPages?.hackathonDetailEmpty || "Content not found"}
        description={dict.appPages?.hackathonDetailEmptyDesc || "The details for this hackathon are not available yet."}
      />
    );
  }

  const sectionText = dict.hackathonDetail?.sections;
  const labelText = dict.hackathonDetail?.labels;
  const statusText = dict.hackathonDetail?.status;
  const emptyText = dict.hackathonDetail?.empty;
  const leaderboardUpdatedAt = leaderboard?.updatedAt ? formatDateTime(leaderboard.updatedAt) : null;

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={summary ? (
          <Badge variant={getHackathonStatusVariant(summary.status)}>
            {dict.hackathonList?.status?.[summary.status] || summary.status}
          </Badge>
        ) : undefined}
      />

      <nav className="sticky top-16 z-20 -mx-2 overflow-x-auto rounded-xl border border-border-base bg-surface-base/95 px-2 py-3 shadow-sm backdrop-blur">
        <div className="flex min-w-max gap-2">
          {sectionIds.map((sectionId) => (
            <a
              key={sectionId}
              href={`#${sectionId}`}
              className="rounded-full border border-border-base px-3 py-2 text-sm font-medium text-content-muted transition-colors hover:border-border-strong hover:text-content-base"
            >
              {sectionText?.[sectionId] || sectionId}
            </a>
          ))}
        </div>
      </nav>

      {feedback ? (
        <Alert variant={feedback.variant} title={feedback.variant === "success" ? pageTitle : dict.appPages?.errorTitle}>
          {feedback.message}
        </Alert>
      ) : null}

      <SectionBlock id="overview" title={sectionText?.overview || "Overview"}>
        {detail?.sections.overview ? (
          <Card>
            <CardContent className="space-y-5 pt-6">
              <p className="text-sm leading-7 text-content-muted">
                {detail.sections.overview.summary || (labelText?.noValue || "-")}
              </p>
              <KeyValueList
                items={[
                  {
                    label: labelText?.allowSolo || "Solo participation",
                    value: detail.sections.overview.teamPolicy?.allowSolo === undefined
                      ? labelText?.noValue || "-"
                      : detail.sections.overview.teamPolicy.allowSolo
                        ? labelText?.allowSolo || "Solo participation allowed"
                        : labelText?.noSolo || "Team participation only",
                  },
                  {
                    label: labelText?.maxTeamSize || "Max team size",
                    value: detail.sections.overview.teamPolicy?.maxTeamSize || (labelText?.noValue || "-"),
                  },
                ]}
              />
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={emptyText?.sectionDescription || "This section does not have public information yet."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="info" title={sectionText?.info || "Info & Notice"}>
        {detail?.sections.info ? (
          <Card>
            <CardContent className="space-y-5 pt-6">
              {detail.sections.info.notice && detail.sections.info.notice.length > 0 ? (
                <ul className="space-y-2 text-sm leading-7 text-content-muted">
                  {detail.sections.info.notice.map((notice) => (
                    <li key={notice} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-base" />
                      <span>{notice}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-3">
                {detail.sections.info.links?.rules ? (
                  <a
                    href={detail.sections.info.links.rules}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary-base hover:underline"
                  >
                    {labelText?.rules || "Rules"}
                  </a>
                ) : null}
                {detail.sections.info.links?.faq ? (
                  <a
                    href={detail.sections.info.links.faq}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary-base hover:underline"
                  >
                    {labelText?.faq || "FAQ"}
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={emptyText?.sectionDescription || "This section does not have public information yet."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="eval" title={sectionText?.eval || "Evaluation"}>
        {detail?.sections.eval ? (
          <Card>
            <CardContent className="space-y-6 pt-6">
              <KeyValueList
                items={[
                  {
                    label: labelText?.metricName || "Metric",
                    value: detail.sections.eval.metricName || (labelText?.noValue || "-"),
                  },
                  {
                    label: labelText?.description || "Description",
                    value: detail.sections.eval.description || (labelText?.noValue || "-"),
                  },
                  {
                    label: labelText?.scoreSource || "Score source",
                    value: detail.sections.eval.scoreSource || (labelText?.noValue || "-"),
                  },
                ]}
              />

              {detail.sections.eval.scoreDisplay?.breakdown && detail.sections.eval.scoreDisplay.breakdown.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-content-subtle">
                    {labelText?.breakdown || "Breakdown"}
                  </h3>
                  <div className="space-y-2">
                    {detail.sections.eval.scoreDisplay.breakdown.map((item) => (
                      <div key={item.key} className="flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3 text-sm">
                        <span className="text-content-base">{item.label}</span>
                        <span className="font-semibold text-content-base">{item.weightPercent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {detail.sections.eval.limits ? (
                <div className="flex flex-wrap gap-2">
                  {detail.sections.eval.limits.maxRuntimeSec ? (
                    <Badge variant="warning">
                      {labelText?.maxRuntime || "Max runtime"}: {detail.sections.eval.limits.maxRuntimeSec}s
                    </Badge>
                  ) : null}
                  {detail.sections.eval.limits.maxSubmissionsPerDay ? (
                    <Badge variant="warning">
                      {labelText?.maxSubmissions || "Max submissions"}: {detail.sections.eval.limits.maxSubmissionsPerDay}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={emptyText?.sectionDescription || "This section does not have public information yet."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="schedule" title={sectionText?.schedule || "Schedule"}>
        {detail?.sections.schedule?.milestones && detail.sections.schedule.milestones.length > 0 ? (
          <Card>
            <CardContent className="space-y-5 pt-6">
              {detail.sections.schedule.timezone ? (
                <Badge variant="default">
                  {labelText?.timezone || "Timezone"}: {detail.sections.schedule.timezone}
                </Badge>
              ) : null}
              <div className="space-y-4">
                {[...detail.sections.schedule.milestones]
                  .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime())
                  .map((milestone) => (
                    <div key={`${milestone.name}-${milestone.at}`} className="rounded-xl border border-border-base bg-surface-base p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-medium text-content-base">{milestone.name}</h3>
                        <span className="text-sm text-content-muted">{formatDateTime(milestone.at)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={emptyText?.sectionDescription || "This section does not have public information yet."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="prize" title={sectionText?.prize || "Prize"}>
        {detail?.sections.prize?.items && detail.sections.prize.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {detail.sections.prize.items.map((item) => (
              <Card key={`${item.place}-${item.amountKRW}`}>
                <CardHeader>
                  <CardTitle>{item.place}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-tight text-content-base">
                    KRW {item.amountKRW.toLocaleString(languageTag)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={labelText?.emptyPrize || "No prize information available."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="teams" title={sectionText?.teams || "Teams"}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-content-muted">
            {teams.length.toLocaleString(languageTag)} {labelText?.teamCount || "teams"}
          </p>
          <Link
            href={`/camp?hackathon=${encodeURIComponent(slug)}`}
            className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-primary-base px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {labelText?.goToCamp || "Go to Camp"}
          </Link>
        </div>

        {teams.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {teams.map((team) => (
              <Card key={team.teamCode}>
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <Badge variant={getTeamStatusVariant(team.isOpen)}>
                      {team.isOpen ? statusText?.recruiting || "Recruiting" : statusText?.closed || "Closed"}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-content-muted">{team.intro}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <KeyValueList
                    items={[
                      {
                        label: labelText?.memberCount || "Members",
                        value: team.memberCount || (labelText?.noValue || "-"),
                      },
                      {
                        label: labelText?.createdAt || "Created",
                        value: formatDateTime(team.createdAt),
                      },
                    ]}
                  />

                  <div className="flex flex-wrap gap-2">
                    {team.lookingFor.length > 0 ? team.lookingFor.map((role) => (
                      <Badge key={role} variant="default">
                        {role}
                      </Badge>
                    )) : (
                      <Badge variant="default">{labelText?.noValue || "-"}</Badge>
                    )}
                  </div>

                  <a
                    href={team.contact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-sm font-medium text-primary-base hover:underline"
                  >
                    {labelText?.contact || "Contact"}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={labelText?.emptyTeams || "No teams looking for members yet."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="submit" title={sectionText?.submit || "Submit"}>
        {detail?.sections.submit ? (
          profile === null ? (
            <Card>
              <CardContent className="space-y-5 pt-6">
                <Alert variant="default" title={labelText?.profileRequired || "Profile required"}>
                  {labelText?.createProfileDesc || "You need a local profile to submit."}
                </Alert>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    handleProfileCreate(String(formData.get("nickname") || ""));
                  }}
                  className="flex flex-col gap-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1">
                    <FormField label={labelText?.nickname || "Nickname"} required>
                      <Input
                        name="nickname"
                        placeholder={dict.hackathonDetail?.placeholders?.nickname || labelText?.nickname || "Nickname"}
                        required
                      />
                    </FormField>
                  </div>
                  <Button type="submit">{labelText?.createProfile || "Create Profile"}</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="space-y-6 pt-6">
                <Alert variant="default" title={labelText?.currentProfile || "Current profile"}>
                  {profile.nickname}
                </Alert>

                {detail.sections.submit.guide && detail.sections.submit.guide.length > 0 ? (
                  <div className="space-y-3 rounded-xl border border-border-base bg-surface-muted p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-content-subtle">
                      {labelText?.submitGuide || "Submission guide"}
                    </h3>
                    <ul className="space-y-2 text-sm leading-7 text-content-muted">
                      {detail.sections.submit.guide.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-base" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <form
                  key={`${activeSubmission?.id || "new"}-${activeSubmission?.updatedAt || "empty"}`}
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const action = formData.get("action") === "draft" ? "draft" : "submit";
                    handleSubmission(action, formData);
                  }}
                  className="space-y-5"
                >
                  <FormField label={labelText?.teamName || "Team name"} required>
                    <Input
                      name="teamName"
                      defaultValue={activeSubmission?.teamName}
                      placeholder={dict.hackathonDetail?.placeholders?.teamName || labelText?.teamName || "Team name"}
                      required
                    />
                  </FormField>

                  {submissionFields.map((field) => (
                    <FormField
                      key={field.key}
                      label={`${field.title} (${field.key})`}
                      description={field.format}
                    >
                      <Input
                        name={`artifact-${field.key}`}
                        defaultValue={activeSubmission?.artifacts[field.key]}
                        placeholder={field.format}
                      />
                    </FormField>
                  ))}

                  <FormField label={labelText?.notes || "Notes"}>
                    <Textarea
                      name="notes"
                      defaultValue={activeSubmission?.notes}
                      placeholder={dict.hackathonDetail?.placeholders?.notes || labelText?.notes || "Notes"}
                    />
                  </FormField>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" variant="outline" name="action" value="draft">
                      {labelText?.saveDraft || "Save Draft"}
                    </Button>
                    <Button type="submit" name="action" value="submit">
                      {labelText?.finalSubmit || "Final Submit"}
                    </Button>
                  </div>

                  {activeSubmission ? (
                    <p className="text-sm text-content-muted">
                      {labelText?.currentStatus || "Current status"}: {statusText?.[activeSubmission.status] || activeSubmission.status}
                      {" · "}
                      {labelText?.lastUpdated || "Last updated"}: {formatDateTime(activeSubmission.updatedAt)}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          )
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={emptyText?.sectionDescription || "This section does not have public information yet."}
          />
        )}
      </SectionBlock>

      <SectionBlock id="leaderboard" title={sectionText?.leaderboard || "Leaderboard"}>
        {leaderboardEntries.length > 0 ? (
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>{sectionText?.leaderboard || "Leaderboard"}</CardTitle>
              {leaderboardUpdatedAt ? (
                <p className="text-sm text-content-muted">
                  {labelText?.lastUpdated || "Last updated"}: {leaderboardUpdatedAt}
                </p>
              ) : null}
            </CardHeader>
            <CardContent>
              <DataTable>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dict.misc.tableRank}</TableHead>
                    <TableHead>{dict.misc.tableTeam}</TableHead>
                    <TableHead>{dict.misc.tableScore}</TableHead>
                    <TableHead>{labelText?.submittedAt || "Submitted at"}</TableHead>
                    <TableHead>{labelText?.artifacts || "Artifacts"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardEntries.map((entry) => (
                    <TableRow key={`${entry.teamName}-${entry.submittedAt || entry.rank || "entry"}`}>
                      <TableCell>{entry.rank ?? (labelText?.noValue || "-")}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-medium text-content-base">{entry.teamName}</div>
                          {entry.status ? (
                            <Badge variant={entry.status === "submitted" ? "success" : "default"}>
                              {entry.status === "submitted"
                                ? statusText?.submitted || entry.status
                                : entry.status}
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div>{formatNumber(entry.score)}</div>
                          {entry.scoreBreakdown ? (
                            <div className="space-y-1 text-xs text-content-muted">
                              {Object.entries(entry.scoreBreakdown).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium text-content-subtle">{key}</span>
                                  <span>{formatNumber(value)}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{formatDateTime(entry.submittedAt)}</TableCell>
                      <TableCell>
                        <div className="space-y-2 text-sm">
                          {entry.artifacts?.webUrl ? (
                            <a href={entry.artifacts.webUrl} target="_blank" rel="noreferrer" className="block text-primary-base hover:underline">
                              Web
                            </a>
                          ) : null}
                          {entry.artifacts?.pdfUrl ? (
                            <a href={entry.artifacts.pdfUrl} target="_blank" rel="noreferrer" className="block text-primary-base hover:underline">
                              PDF
                            </a>
                          ) : null}
                          {entry.artifacts?.planTitle ? <div>{entry.artifacts.planTitle}</div> : null}
                          {entry.artifacts === undefined ? <span>{labelText?.noValue || "-"}</span> : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTable>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText?.sectionTitle || "No details available"}
            description={labelText?.emptyLeaderboard || "Leaderboard is empty."}
          />
        )}
      </SectionBlock>
    </div>
  );
}
