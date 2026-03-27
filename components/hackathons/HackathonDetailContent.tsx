"use client";

import { useEffect, useMemo, useState } from "react";
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
  title,
}: {
  children: React.ReactNode;
  id: (typeof sectionIds)[number];
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-32 space-y-8">
      <div className="flex items-center justify-between gap-4 border-b-8 border-content-base pb-4">
        <h2 className="text-2xl font-black tracking-tighter text-content-base uppercase">{title}</h2>
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
        writeSubmissions(previousSubmissions);
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

  return (
    <div className="space-y-10 pb-20">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={summary ? (
          <Badge variant="default" className="text-base py-1 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {dict.hackathonList.status[summary.status] || summary.status}
          </Badge>
        ) : undefined}
      />

      <nav className="sticky top-32 z-20 overflow-x-auto border-2 border-content-base bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:top-24">
        <div className="flex min-w-max gap-4 px-2 py-2">
          {sectionIds.map((sectionId) => (
            <a
              key={sectionId}
              href={`#${sectionId}`}
              className="border-2 border-content-base px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-content-base transition-all hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#f4f4f0]"
            >
              {sectionText[sectionId] || sectionId}
            </a>
          ))}
        </div>
      </nav>

      {feedback ? (
        <Alert variant={feedback.variant} title={feedback.variant === "success" ? pageTitle : dict.appPages.errorTitle}>
          {feedback.message}
        </Alert>
      ) : null}

      <SectionBlock id="overview" title={sectionText.overview}>
        {detail?.sections.overview ? (
          <Card>
            <CardContent className="space-y-5 pt-5">
              <p className="text-sm font-medium leading-relaxed text-content-base border-l-4 border-primary-base pl-6 py-2">
                {detail.sections.overview.summary || (labelText.noValue)}
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
                    value: detail.sections.overview.teamPolicy?.maxTeamSize || (labelText.noValue),
                  },
                ]}
              />
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={emptyText.sectionDescription}
          />
        )}
      </SectionBlock>

      <SectionBlock id="info" title={sectionText.info}>
        {detail?.sections.info ? (
          <Card>
            <CardContent className="space-y-5 pt-5">
              {detail.sections.info.notice && detail.sections.info.notice.length > 0 ? (
                <ul className="space-y-4 text-sm font-medium leading-relaxed text-content-base border-4 border-content-base p-6 bg-yellow-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  {detail.sections.info.notice.map((notice) => (
                    <li key={notice} className="flex gap-4 items-start">
                      <span className="mt-2 h-4 w-4 bg-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0" />
                      <span>{notice}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-6">
                {detail.sections.info.links?.rules ? (
                  <a
                    href={detail.sections.info.links.rules}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center border-4 border-content-base bg-[#f4f4f0] px-8 py-4 text-xl font-black uppercase tracking-widest text-content-base transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300"
                  >
                    {labelText.rules} →
                  </a>
                ) : null}
                {detail.sections.info.links?.faq ? (
                  <a
                    href={detail.sections.info.links.faq}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center border-4 border-content-base bg-[#f4f4f0] px-8 py-4 text-xl font-black uppercase tracking-widest text-content-base transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300"
                  >
                    {labelText.faq} →
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={emptyText.sectionDescription}
          />
        )}
      </SectionBlock>

      <SectionBlock id="eval" title={sectionText.eval}>
        {detail?.sections.eval ? (
          <Card>
            <CardContent className="space-y-10 pt-8">
              <KeyValueList
                items={[
                  {
                    label: labelText.metricName,
                    value: detail.sections.eval.metricName || (labelText.noValue),
                  },
                  {
                    label: labelText.description,
                    value: detail.sections.eval.description || (labelText.noValue),
                  },
                  {
                    label: labelText.scoreSource,
                    value: detail.sections.eval.scoreSource || (labelText.noValue),
                  },
                ]}
              />

              {detail.sections.eval.scoreDisplay?.breakdown && detail.sections.eval.scoreDisplay.breakdown.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-widest text-content-base inline-block border-b-4 border-content-base pb-2">
                    {labelText.breakdown}
                  </h3>
                  <div className="space-y-4">
                    {detail.sections.eval.scoreDisplay.breakdown.map((item) => (
                      <div key={item.key} className="flex items-center justify-between border-4 border-content-base bg-[#f4f4f0] px-6 py-4 text-xl hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <span className="font-bold text-content-base">{item.label}</span>
                        <span className="font-black text-content-base">{item.weightPercent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {detail.sections.eval.limits ? (
                <div className="flex flex-wrap gap-4 p-6 border-4 border-content-base bg-blue-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[1deg]">
                  {detail.sections.eval.limits.maxRuntimeSec ? (
                    <Badge variant="default" className="text-lg">
                      {labelText.maxRuntime}: {detail.sections.eval.limits.maxRuntimeSec}{labelText.runtimeUnit}
                    </Badge>
                  ) : null}
                  {detail.sections.eval.limits.maxSubmissionsPerDay ? (
                    <Badge variant="default" className="text-lg">
                      {labelText.maxSubmissions}: {detail.sections.eval.limits.maxSubmissionsPerDay}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={emptyText.sectionDescription}
          />
        )}
      </SectionBlock>

      <SectionBlock id="schedule" title={sectionText.schedule}>
        {detail?.sections.schedule?.milestones && detail.sections.schedule.milestones.length > 0 ? (
          <Card>
            <CardContent className="space-y-5 pt-5">
              {detail.sections.schedule.timezone ? (
                <div className="inline-block border-4 border-content-base bg-content-base text-white px-4 py-1.5 font-black uppercase tracking-widest text-lg shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
                  {labelText.timezone}: {detail.sections.schedule.timezone}
                </div>
              ) : null}
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-content-base">
                {[...detail.sections.schedule.milestones]
                  .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime())
                  .map((milestone) => (
                    <div key={`${milestone.name}-${milestone.at}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-12 h-12 border-4 border-content-base rounded-none bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                        <div className="w-3 h-3 bg-content-base"></div>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] border-4 border-content-base bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:-translate-y-1">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-black text-xl text-content-base uppercase">{milestone.name}</h3>
                          <span className="text-lg font-bold text-primary-base">{formatDateTime(milestone.at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={emptyText.sectionDescription}
          />
        )}
      </SectionBlock>

      <SectionBlock id="prize" title={sectionText.prize}>
        {detail?.sections.prize?.items && detail.sections.prize.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {detail.sections.prize.items.map((item, idx) => (
              <Card key={`${item.place}-${item.amountKRW}`} className={idx === 0 ? "bg-yellow-300 rotate-[-2deg]" : idx === 1 ? "bg-slate-200 rotate-[1deg]" : "bg-orange-200"}>
                <CardHeader className="bg-transparent border-b-4 border-content-base pb-6">
                  <CardTitle className="text-4xl">{item.place}</CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <p className="text-4xl lg:text-5xl font-black tracking-tighter text-content-base">
                    {labelText.prizeCurrency} <br/><span className="text-primary-base">{item.amountKRW.toLocaleString(languageTag)}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={labelText.emptyPrize}
          />
        )}
      </SectionBlock>

      <SectionBlock id="teams" title={sectionText.teams}>
        <div className="flex flex-wrap items-center justify-between gap-6 border-4 border-content-base bg-[#f4f4f0] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-black text-content-base uppercase tracking-widest">
            {labelText.teamCount.replace("{count}", teams.length.toLocaleString(languageTag))}
          </p>
          <Link
            href={`/camp?hackathon=${encodeURIComponent(slug)}`}
            className="inline-flex h-14 items-center justify-center border-4 border-content-base bg-primary-base px-8 text-sm font-bold uppercase tracking-wider text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            {labelText.goToCamp} →
          </Link>
        </div>

        {teams.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {teams.map((team) => (
              <Card key={team.teamCode}>
                <CardHeader className="space-y-4 bg-content-base text-white border-b-4 border-content-base">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg text-white">{team.name}</CardTitle>
                    <Badge variant={getTeamStatusVariant(team.isOpen)} className="text-sm py-1 px-3">
                      {team.isOpen ? statusText.recruiting : statusText.closed}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{team.intro}</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 bg-white">
                  <KeyValueList
                    items={[
                      {
                        label: labelText.memberCount,
                        value: team.memberCount || (labelText.noValue),
                      },
                      {
                        label: labelText.createdAt,
                        value: formatDateTime(team.createdAt),
                      },
                    ]}
                  />

                  <div className="space-y-3">
                     <p className="font-black uppercase tracking-widest text-sm text-content-subtle">{labelText.lookingFor}</p>
                     <div className="flex flex-wrap gap-3">
                      {team.lookingFor.length > 0 ? team.lookingFor.map((role) => (
                        <span key={role} className="border-2 border-content-base bg-blue-100 px-3 py-1 font-bold text-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {role}
                        </span>
                      )) : (
                        <span className="border-2 border-content-base bg-[#f4f4f0] px-3 py-1 font-bold text-content-base">{labelText.noValue}</span>
                      )}
                    </div>
                  </div>

                  <a
                    href={team.contact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full justify-center border-4 border-content-base bg-yellow-300 py-4 text-xl font-black uppercase tracking-widest text-content-base transition-all hover:bg-content-base hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-4"
                  >
                    {labelText.contact} →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={labelText.emptyTeams}
          />
        )}
      </SectionBlock>

      <SectionBlock id="submit" title={sectionText.submit}>
        {detail?.sections.submit ? (
          profile === null ? (
            <Card className="bg-red-50">
              <CardContent className="space-y-5 pt-5">
                <Alert variant="danger" title={labelText.profileRequired}>
                  {labelText.createProfileDesc}
                </Alert>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    handleProfileCreate(String(formData.get("nickname")));
                  }}
                  className="flex flex-col gap-6 sm:flex-row sm:items-end border-4 border-content-base p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
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
                  <Button type="submit" variant="primary" className="h-12 w-full sm:w-auto px-8">{labelText.createProfile}</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="space-y-10 pt-8">
                <div className="flex items-center gap-4 border-4 border-content-base bg-blue-100 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-12 h-12 bg-content-base text-white flex items-center justify-center font-black text-2xl">👤</div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-content-subtle">{labelText.currentProfile}</p>
                    <p className="text-2xl font-black text-content-base">{profile.nickname}</p>
                  </div>
                </div>

                {detail.sections.submit.guide && detail.sections.submit.guide.length > 0 ? (
                  <div className="space-y-4 border-4 border-content-base bg-yellow-100 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase tracking-widest text-content-base mb-4 inline-block border-b-4 border-content-base pb-2">
                      {labelText.submitGuide}
                    </h3>
                    <ul className="space-y-3 text-sm font-medium leading-relaxed text-content-base">
                      {detail.sections.submit.guide.map((item) => (
                        <li key={item} className="flex gap-4 items-start">
                          <span className="mt-2 h-4 w-4 bg-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0" />
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
                    const formData = new FormData(event.currentTarget);
                    const action = formData.get("action") === "draft" ? "draft" : "submit";
                    handleSubmission(action, formData);
                  }}
                  className="space-y-8 border-4 border-content-base p-8 bg-[#f4f4f0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
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

                  <FormField label={labelText.notes}>
                    <Textarea
                      name="notes"
                      defaultValue={activeSubmission?.notes}
                      placeholder={dict.hackathonDetail.placeholders.notes || labelText.notes}
                    />
                  </FormField>

                  <div className="flex flex-wrap gap-4 pt-4 border-t-4 border-content-base pt-8">
                    <Button type="submit" variant="outline" name="action" value="draft" className="h-16 px-10 text-xl flex-1 md:flex-none bg-white">
                      {labelText.saveDraft}
                    </Button>
                    <Button type="submit" variant="primary" name="action" value="submit" className="h-16 px-10 text-xl flex-1 md:flex-none bg-primary-base text-white border-content-base">
                      {labelText.finalSubmit}
                    </Button>
                  </div>

                  {activeSubmission ? (
                    <div className="mt-8 border-4 border-content-base bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <p className="text-lg font-bold text-content-base">
                        <span className="font-black uppercase">{labelText.currentStatus}:</span>{" "}
                        <Badge variant={activeSubmission.status === "submitted" ? "success" : "default"} className="mx-2">
                          {statusText[activeSubmission.status] || activeSubmission.status}
                        </Badge>
                        <br className="md:hidden" />
                        <span className="md:inline hidden">{" · "}</span>
                        <span className="font-black uppercase ml-0 md:ml-2">{labelText.lastUpdated}:</span> {formatDateTime(activeSubmission.updatedAt)}
                      </p>
                    </div>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          )
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={emptyText.sectionDescription}
          />
        )}
      </SectionBlock>

      <SectionBlock id="leaderboard" title={sectionText.leaderboard}>
        {leaderboardEntries.length > 0 ? (
          <div className="border-4 border-content-base bg-white shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-content-base bg-[#f4f4f0] p-8">
              <h3 className="text-xl font-black uppercase tracking-tighter">{sectionText.leaderboard}</h3>
              {leaderboardUpdatedAt ? (
                <p className="text-xs font-bold text-content-subtle bg-white border-2 border-content-base px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {labelText.lastUpdated}: {leaderboardUpdatedAt}
                </p>
              ) : null}
            </div>
            <div className="p-8">
              <DataTable>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">{dict.misc.tableRank}</TableHead>
                    <TableHead>{dict.misc.tableTeam}</TableHead>
                    <TableHead>{dict.misc.tableScore}</TableHead>
                    <TableHead>{labelText.submittedAt}</TableHead>
                    <TableHead>{labelText.artifacts}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardEntries.map((entry, idx) => (
                    <TableRow key={`${entry.teamName}-${entry.submittedAt || entry.rank}`} className={idx < 3 ? "bg-yellow-50" : ""}>
                      <TableCell className="font-black text-2xl">
                        {idx === 0 ? "🏆" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : entry.rank ?? (labelText.noValue)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-black text-xl text-content-base">{entry.teamName}</div>
                          {entry.status ? (
                            <Badge variant={entry.status === "submitted" ? "success" : "default"}>
                              {entry.status === "submitted"
                                ? statusText.submitted || entry.status
                                : entry.status}
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-mono text-2xl font-black text-primary-base">{formatNumber(entry.score)}</div>
                          {entry.scoreBreakdown ? (
                            <div className="space-y-1 text-sm font-bold text-content-subtle border-l-4 border-content-base pl-2">
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
                      <TableCell className="font-bold">{formatDateTime(entry.submittedAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 text-sm font-black uppercase tracking-widest">
                          {entry.artifacts?.webUrl ? (
                            <a href={entry.artifacts.webUrl} target="_blank" rel="noreferrer" className="block border-2 border-content-base bg-white px-3 py-1 hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                              {labelText.web}
                            </a>
                          ) : null}
                          {entry.artifacts?.pdfUrl ? (
                            <a href={entry.artifacts.pdfUrl} target="_blank" rel="noreferrer" className="block border-2 border-content-base bg-white px-3 py-1 hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                              {labelText.pdf}
                            </a>
                          ) : null}
                          {entry.artifacts?.planTitle ? <div className="border-2 border-content-base bg-surface-muted px-3 py-1">{entry.artifacts.planTitle}</div> : null}
                          {entry.artifacts === undefined ? <span>{labelText.noValue}</span> : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTable>
            </div>
          </div>
        ) : (
          <EmptyState
            title={emptyText.sectionTitle}
            description={labelText.emptyLeaderboard}
          />
        )}
      </SectionBlock>
    </div>
  );
}
