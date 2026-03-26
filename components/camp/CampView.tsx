"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { Checkbox } from "@/components/design-system/primitives/Checkbox";
import { Input } from "@/components/design-system/primitives/Input";
import { Select } from "@/components/design-system/primitives/Select";
import { Textarea } from "@/components/design-system/primitives/Textarea";
import { ActionGate } from "@/components/design-system/patterns/ActionGate";
import { EmptyState } from "@/components/design-system/patterns/EmptyState";
import { LoadingState } from "@/components/design-system/patterns/LoadingState";
import { cn } from "@/lib/cn";
import { createLocalTeamCode } from "@/lib/ids/local";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { createLocalProfile, getLocalProfile, saveLocalProfile } from "@/lib/profile/localProfile";
import { readHackathons } from "@/lib/storage/entities/hackathons";
import { readTeams, writeTeams } from "@/lib/storage/entities/teams";
import type { HackathonSummary, TeamPost } from "@/types";

interface CampViewProps {
  initialHackathonSlug?: string;
}

type Notice = {
  variant: "default" | "success" | "danger";
  title: string;
  description: string;
};

function parseRoles(value: string) {
  return value
    .split(",")
    .map((role) => role.trim())
    .filter((role) => role.length > 0);
}

export function CampView({ initialHackathonSlug }: CampViewProps) {
  const { dict, locale } = useI18n();
  const [isReady, setIsReady] = useState(false);
  const [teams, setTeams] = useState<TeamPost[]>([]);
  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [profile, setProfile] = useState<ReturnType<typeof getLocalProfile>>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const [nickname, setNickname] = useState("");
  const [teamName, setTeamName] = useState("");
  const [intro, setIntro] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [teamHackathonSlug, setTeamHackathonSlug] = useState(initialHackathonSlug ?? "");

  const filterHackathonSlug = initialHackathonSlug?.trim() || undefined;

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
    () => hackathons.find((hackathon) => hackathon.slug === filterHackathonSlug),
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
    return new Map(hackathons.map((hackathon) => [hackathon.slug, hackathon.title]));
  }, [hackathons]);

  function resetComposer() {
    setTeamName("");
    setIntro("");
    setLookingFor("");
    setContactUrl("");
    setIsOpen(true);
    setTeamHackathonSlug(filterHackathonSlug ?? "");
  }

  function handleCreateProfile() {
    const nextNickname = nickname.trim();

    if (nextNickname.length === 0) {
      return;
    }

    const nextProfile = createLocalProfile(nextNickname);

    if (!saveLocalProfile(nextProfile)) {
      setNotice({
        variant: "danger",
        title: dict.campForm?.createProfileErrorTitle || "Unable to save profile",
        description: dict.campForm?.createProfileErrorDesc || "Please try again.",
      });
      return;
    }

    setProfile(nextProfile);
    setNickname("");
    setNotice({
      variant: "success",
      title: dict.campForm?.createProfileSuccessTitle || "Profile ready",
      description: dict.campForm?.createProfileSuccessDesc || "You can now create a team post.",
    });
  }

  function handleCreateTeam(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (profile === null) {
      return;
    }

    const nextName = teamName.trim();
    const nextIntro = intro.trim();

    if (nextName.length === 0 || nextIntro.length === 0) {
      return;
    }

    const createdAt = new Date().toISOString();
    const nextTeam: TeamPost = {
      teamCode: createLocalTeamCode(),
      hackathonSlug: teamHackathonSlug || undefined,
      ownerProfileId: profile.id,
      ownerNicknameSnapshot: profile.nickname,
      name: nextName,
      isOpen,
      lookingFor: parseRoles(lookingFor),
      intro: nextIntro,
      contact: {
        type: "link",
        url: contactUrl.trim(),
      },
      createdAt,
    };

    const nextTeams = [nextTeam, ...teams];

    if (!writeTeams(nextTeams)) {
      setNotice({
        variant: "danger",
        title: dict.campForm?.saveErrorTitle || "Unable to save the team post",
        description: dict.campForm?.saveErrorDesc || "Please try again.",
      });
      return;
    }

    setTeams(nextTeams);
    resetComposer();
    setIsComposerOpen(false);
    setNotice({
      variant: "success",
      title: dict.campForm?.saveSuccessTitle || "Team post created",
      description: dict.campForm?.saveSuccessDesc || "Your team post is now visible in the list.",
    });
  }

  if (!isReady) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <LoadingState label={dict.appPages?.loadingLabel} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-white border-b border-slate-200 py-8 sm:py-10 shadow-sm w-full mb-5 rounded-b-2xl -mt-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600 opacity-[0.04] filter blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.03),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="flex flex-col space-y-3">
            <div className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {dict.appNav?.camp || "Camp"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              {dict.appPages?.campTitle || "Camp"}
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              {pageDescription}
            </p>
          </div>
          <div className="shrink-0">
            <Button
              variant={isComposerOpen ? "outline" : "primary"}
              className={isComposerOpen 
                ? "h-10 px-5 text-sm font-medium rounded-full border border-slate-200/80 bg-white/80 backdrop-blur-sm hover:bg-slate-50/80 text-slate-700 shadow-sm transition-all" 
                : "h-10 px-5 text-sm font-semibold rounded-full bg-blue-600 text-white shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_12px_20px_-6px_rgba(37,99,235,0.5)] transition-all ring-1 ring-blue-600/50"}
              onClick={() => {
                setIsComposerOpen((current) => !current);
                setNotice(null);
              }}
            >
              {isComposerOpen
                ? dict.campForm?.toggleClose || "Close form"
                : dict.campForm?.toggleOpen || "Create team post"}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-12 space-y-8">
        {notice !== null ? (
          <Alert variant={notice.variant} title={notice.title} className="!border !border-slate-200/60 !shadow-sm !rounded-xl !bg-white/80 backdrop-blur-sm ring-1 ring-white/50 !p-4 !text-slate-700 !text-sm !font-normal">
            {notice.description}
          </Alert>
        ) : null}

        {filterHackathonSlug !== undefined ? (
          <Alert variant="warning" title={dict.campList?.filterTitle || "Hackathon filter"} className="!border !border-amber-200/60 !shadow-sm !rounded-xl !bg-amber-50/80 backdrop-blur-sm ring-1 ring-white/50 !p-4 !text-amber-900 !text-sm !font-normal">
            {activeHackathon !== undefined
              ? `${dict.campList?.filterDesc || "Showing posts for"} ${activeHackathon.title}`
              : `${dict.campList?.filterDesc || "Showing posts for"} ${dict.campList?.hackathonLabel || "Hackathon"}`}
          </Alert>
        ) : null}

        {isComposerOpen ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <ActionGate
              isAllowed={profile !== null}
              title={dict.campForm?.createProfileTitle || "Profile required"}
              description={dict.campForm?.createProfileDesc || "You need a profile before creating a team post."}
            >
              <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-500 ring-1 ring-white/50">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4 px-5 pt-5">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900">{dict.campForm?.createTeamTitle || "Create a team"}</CardTitle>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {dict.campForm?.postingAs || "Posting with your local profile:"} <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">{profile?.nickname}</span>
                  </p>
                </CardHeader>
                <CardContent className="p-5">
                  <form onSubmit={handleCreateTeam} className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-1.5">
                      <label htmlFor="camp-team-name" className="text-sm font-semibold text-slate-700 mb-1 block ml-1">
                        {dict.campForm?.teamName || "Team name"}
                      </label>
                      <Input
                        id="camp-team-name"
                        value={teamName}
                        onChange={(event) => setTeamName(event.target.value)}
                        required
                        className="text-sm bg-white/50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm h-10 px-3"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label htmlFor="camp-team-intro" className="text-sm font-semibold text-slate-700 mb-1 block ml-1">
                        {dict.campForm?.intro || "Introduction"}
                      </label>
                      <Textarea
                        id="camp-team-intro"
                        value={intro}
                        onChange={(event) => setIntro(event.target.value)}
                        required
                        className="text-sm bg-white/50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm min-h-[96px] p-3"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="camp-team-looking-for" className="text-sm font-semibold text-slate-700 mb-1 block ml-1">
                        {dict.campForm?.lookingFor || "Looking for"}
                      </label>
                      <Input
                        id="camp-team-looking-for"
                        value={lookingFor}
                        onChange={(event) => setLookingFor(event.target.value)}
                        placeholder={dict.campForm?.lookingForPlaceholder || "Frontend, Designer"}
                        className="text-sm bg-white/50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm h-10 px-3"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="camp-team-contact-url" className="text-sm font-semibold text-slate-700 mb-1 block ml-1">
                        {dict.campForm?.contactUrl || "Contact URL"}
                      </label>
                      <Input
                        id="camp-team-contact-url"
                        type="url"
                        value={contactUrl}
                        onChange={(event) => setContactUrl(event.target.value)}
                        placeholder="https://"
                        className="text-sm bg-white/50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm h-10 px-3"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="camp-team-hackathon" className="text-sm font-semibold text-slate-700 mb-1 block ml-1">
                        {dict.campForm?.hackathonSlug || "Hackathon"}
                      </label>
                      <Select
                        id="camp-team-hackathon"
                        value={teamHackathonSlug}
                        onChange={(event) => setTeamHackathonSlug(event.target.value)}
                        className="text-sm bg-white/50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm h-10 px-3"
                      >
                        <option value="">{dict.campForm?.hackathonNone || "No linked hackathon"}</option>
                        {hackathons.map((hackathon) => (
                          <option key={hackathon.slug} value={hackathon.slug}>
                            {hackathon.title}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="flex items-center gap-3 border border-slate-200/80 rounded-2xl bg-slate-50/50 px-4 py-2 h-10 shadow-sm">
                      <Checkbox
                        id="camp-team-open"
                        checked={isOpen}
                        onChange={(event) => setIsOpen(event.target.checked)}
                        className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-600/20"
                      />
                      <label htmlFor="camp-team-open" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        {dict.campForm?.isOpen || "Currently recruiting"}
                      </label>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap justify-end gap-4 pt-5 border-t border-slate-100/80 mt-1">
                      <Button type="button" variant="outline" onClick={resetComposer} className="h-10 px-5 text-sm font-medium rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow transition-all">
                        {dict.campForm?.reset || "Reset"}
                      </Button>
                      <Button type="submit" variant="primary" className="h-10 px-6 text-sm font-semibold rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all">
                        {dict.campForm?.submit || "Create team post"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </ActionGate>

            {profile === null ? (
              <Card className="max-w-xl mx-auto border border-blue-100/50 shadow-2xl shadow-blue-900/5 bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden mt-8 ring-1 ring-white/50">
                <CardHeader className="bg-gradient-to-b from-blue-50/80 to-transparent border-b border-slate-100/50 pb-4 px-5 pt-5">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900">{dict.campForm?.createProfileBtn || "Create profile"}</CardTitle>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {dict.campForm?.profileHint || "Only a nickname is stored in this browser."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-5 p-5 bg-transparent">
                  <div className="space-y-1.5">
                    <label htmlFor="camp-profile-nickname" className="text-sm font-semibold text-slate-700 mb-1 block ml-1">
                      {dict.campForm?.createProfileInputLabel || "Nickname"}
                    </label>
                    <Input
                      id="camp-profile-nickname"
                      placeholder={dict.campForm?.createProfileInputPlaceholder || "Nickname"}
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                       className="text-sm bg-white/80 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm h-10 px-3"
                    />
                  </div>
                  <Button className="w-full h-10 mt-5 text-sm font-semibold rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all" onClick={handleCreateProfile}>
                    {dict.campForm?.createProfileBtn || "Create profile"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : null}

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
              <Card key={team.teamCode} className="h-full flex flex-col group border border-slate-200/60 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-1 rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden ring-1 ring-white/50">
                <CardHeader className="space-y-3 bg-gradient-to-b from-slate-50/80 to-transparent border-b border-slate-100/50 pb-4 px-5 pt-5 group-hover:from-blue-50/50 transition-colors duration-500">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <CardTitle className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">{team.name}</CardTitle>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold tracking-wide ring-1 ring-inset whitespace-nowrap",
                        team.isOpen
                          ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                          : "bg-slate-50 text-slate-500 ring-slate-200/80",
                      )}
                    >
                      {team.isOpen
                        ? dict.campList?.statusOpen || "Open"
                        : dict.campList?.statusClosed || "Closed"}
                    </span>
                  </div>
                  {team.ownerNicknameSnapshot !== undefined ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-500">{team.ownerNicknameSnapshot.charAt(0).toUpperCase()}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600">
                        {dict.campList?.ownerLabel || "Owner"}: <span className="text-slate-900 font-semibold">{team.ownerNicknameSnapshot}</span>
                      </p>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-4 p-5 flex-1 flex flex-col bg-transparent">
                  <p className="text-sm leading-relaxed text-slate-700 flex-1">{team.intro}</p>

                  <dl className="space-y-3 text-sm pt-4 border-t border-slate-100/80 mt-4">
                    {team.hackathonSlug !== undefined ? (
                      <div className="flex flex-col gap-1 bg-slate-50/50 rounded-xl px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <dt className="font-semibold text-slate-600">{dict.campList?.hackathonLabel || "Hackathon"}</dt>
                        <dd className="text-left sm:text-right font-bold text-slate-900 max-w-full sm:max-w-[150px] line-clamp-2">{hackathonTitle}</dd>
                      </div>
                    ) : null}

                    {team.lookingFor.length > 0 ? (
                      <div className="space-y-3 px-1">
                        <dt className="font-semibold text-slate-600">{dict.campList?.lookingForLabel || "Looking for"}</dt>
                        <dd className="flex flex-wrap gap-2">
                          {team.lookingFor.map((role) => (
                            <span
                              key={`${team.teamCode}-${role}`}
                              className="bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 px-2.5 py-0.5 text-[11px] font-bold rounded-full"
                            >
                              {role}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}

                    {team.contact.url.length > 0 ? (
                      <div className="flex items-center justify-between gap-4 px-1 pt-2">
                         <dt className="font-semibold text-slate-600">{dict.campList?.contactLabel || "Contact"}</dt>
                        <dd className="text-right">
                          <a
                            href={team.contact.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 hover:underline underline-offset-4 bg-blue-50/50 px-2 py-1 rounded-md"
                          >
                            {dict.campList?.contactLink || "Open link"}
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-4 px-1 pt-2 border-t border-slate-100/50">
                      <dt className="font-semibold text-slate-600">{dict.campList?.createdAtLabel || "Created"}</dt>
                      <dd className="text-right font-medium text-slate-600 text-xs">
                        {dateFormatter.format(new Date(team.createdAt))}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}
