"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
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

export function CampView({ initialHackathonSlug }: CampViewProps) {
  const { dict, locale } = useI18n();
  const [isReady, setIsReady] = useState(false);
  const [teams, setTeams] = useState<TeamPost[]>([]);
  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [profile, setProfile] = useState<ReturnType<typeof getLocalProfile>>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasModalOpen = useRef(false);

  const filterHackathonSlug = initialHackathonSlug?.trim() || undefined;

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
    ? `${dict.appPages?.campDesc || "Find your team and collaborate."} ${activeHackathon.title}`
    : dict.appPages?.campDesc || "Find your team and collaborate.";

  useDocumentMetadata({
    title: `${dict.appPages?.campTitle || "Camp"} | HackPlatform`,
    description: pageDescription,
  });

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(toLanguageTag(locale), { dateStyle: "medium", timeStyle: "short" }),
    [locale],
  );

  const filteredTeams = useMemo(() => {
    const nextTeams = [...teams].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));

    if (filterHackathonSlug === undefined) {
      return nextTeams;
    }

    return nextTeams.filter((team) => team.hackathonSlug === filterHackathonSlug);
  }, [filterHackathonSlug, teams]);

  const hackathonTitleBySlug = useMemo(() => {
    return new Map(hackathons.map((h) => [h.slug, h.title]));
  }, [hackathons]);

  const handleWizardSubmit = (newTeam: TeamPost): TeamSubmitResult => {
    const nextTeams = [newTeam, ...teams];

    if (!writeTeams(nextTeams)) {
      return {
        ok: false,
        title: dict.campForm?.saveErrorTitle || "Unable to save the team post",
        description: dict.campForm?.saveErrorDesc || "Please try again.",
      };
    }

    setTeams(nextTeams);
    setIsWizardOpen(false);
    setNotice({
      variant: "success",
      title: dict.campForm?.saveSuccessTitle || "Team post created",
      description: dict.campForm?.saveSuccessDesc || "Your team post is now visible in the list.",
    });
    return { ok: true };
  };

  if (!isReady) {
    return <LoadingState label={dict.appPages?.loadingLabel} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      <aside className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24">
        <div className="space-y-6 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {dict.appNav?.camp || "Camp"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dict.appPages?.campTitle || "Camp"}</h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{pageDescription}</p>
            </div>
          </div>
          
          <Button
            ref={triggerRef}
            variant="primary"
            className="w-full justify-center shadow-md bg-blue-600 hover:bg-blue-700 font-semibold"
            onClick={() => { setIsWizardOpen(true); setNotice(null); }}
          >
            {dict.campForm?.toggleOpen || "Create team post"}
          </Button>
        </div>

        {filterHackathonSlug !== undefined && activeHackathon !== undefined && (
           <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-2">
             <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">{dict.campList?.filterTitle || "Hackathon Filter"}</p>
             <p className="text-sm text-amber-900">{dict.campList?.filterDesc || "Showing posts for"} <strong className="font-semibold text-amber-950">{activeHackathon.title}</strong></p>
             <Link href="/camp" className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 mt-3">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
               {dict.hackathonList?.filters?.clear || "Clear filter"}
             </Link>
           </div>
        )}
      </aside>

      <main className="flex-1 w-full min-w-0">
        <div className="space-y-6">
          {notice !== null && (
            <Alert variant={notice.variant} title={notice.title} className="!border !border-slate-200/60 !shadow-sm !rounded-xl !bg-white/80 backdrop-blur-sm ring-1 ring-white/50 !p-4 !text-slate-700 !text-sm !font-normal">
              {notice.description}
            </Alert>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">
              {filteredTeams.length} results found
            </p>
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
                  title: dict.campForm?.createProfileSuccessTitle || "Profile ready",
                  description: dict.campForm?.createProfileSuccessDesc || "You can now create a team post.",
                });
              }}
              onSubmit={handleWizardSubmit}
              hackathons={hackathons}
              initialHackathonSlug={filterHackathonSlug}
            />
          )}

          {filteredTeams.length === 0 ? (
            <EmptyState
              title={dict.appPages?.campEmpty || "No teams looking for members"}
              description={dict.appPages?.campEmptyDesc || "Be the first to create a team and start recruiting."}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map((team) => {
                const hackathonTitle = team.hackathonSlug
                  ? hackathonTitleBySlug.get(team.hackathonSlug) ?? (dict.campList?.hackathonLabel || "Hackathon")
                  : undefined;

                return (
                  <Card key={team.teamCode} className="h-full flex flex-col group border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-white overflow-hidden">
                    <CardHeader className="space-y-3 bg-slate-50/50 border-b border-slate-100 pb-4 px-5 pt-5 transition-colors duration-300">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{team.name}</CardTitle>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide border whitespace-nowrap",
                            team.isOpen
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 text-slate-500 border-slate-200",
                          )}
                        >
                          {team.isOpen
                            ? dict.campList?.statusOpen || "Open"
                            : dict.campList?.statusClosed || "Closed"}
                        </span>
                      </div>
                      {team.ownerNicknameSnapshot !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600">{team.ownerNicknameSnapshot.charAt(0).toUpperCase()}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            <span className="text-slate-900 font-semibold">{team.ownerNicknameSnapshot}</span>
                          </p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4 p-5 flex-1 flex flex-col">
                      <p className="text-sm leading-relaxed text-slate-700 flex-1">{team.intro}</p>

                      <div className="mt-4 flex flex-col justify-end space-y-3 border-t border-slate-100 pt-4 text-sm">
                        {team.hackathonSlug !== undefined && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <span className="font-semibold text-slate-500">{dict.campList?.hackathonLabel || "Hackathon"}</span>
                            <span className="text-left sm:text-right font-semibold text-slate-900 max-w-full sm:max-w-[150px] line-clamp-2">{hackathonTitle}</span>
                          </div>
                        )}

                        {team.lookingFor.length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-slate-50">
                            <span className="font-semibold text-slate-500 block">{dict.campList?.lookingForLabel || "Looking for"}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {team.lookingFor.map((role) => (
                                <span
                                  key={`${team.teamCode}-${role}`}
                                  className="bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold rounded"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                          <span className="font-semibold text-slate-500">{dict.campList?.createdAtLabel || "Created"}</span>
                          <span className="text-right font-medium text-slate-500 text-xs">
                            {dateFormatter.format(new Date(team.createdAt))}
                          </span>
                        </div>

                        {team.contact.url.length > 0 && (
                          <div className="pt-2">
                             <a
                                href={team.contact.url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                              >
                                {dict.campList?.contactLink || "Contact Team"}
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
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
