"use client";

import { startTransition, useEffect, useMemo, useState, type FormEvent } from "react";
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
import { PageHeader } from "@/components/design-system/patterns/PageHeader";
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

  function handleCreateTeam(event: FormEvent<HTMLFormElement>) {
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
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <LoadingState label={dict.appPages?.loadingLabel} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      <PageHeader
        title={dict.appPages?.campTitle || "Camp"}
        description={pageDescription}
        actions={(
          <Button
            variant={isComposerOpen ? "outline" : "brutal"}
            className={isComposerOpen ? "h-16 px-10 text-xl" : "bg-primary-base text-white border-content-base text-xl px-10 h-16"}
            onClick={() => {
              setIsComposerOpen((current) => !current);
              setNotice(null);
            }}
          >
            {isComposerOpen
              ? dict.campForm?.toggleClose || "Close form"
              : dict.campForm?.toggleOpen || "Create team post"}
          </Button>
        )}
      />

      <div className="space-y-12 mt-8">
        {notice !== null ? (
          <Alert variant={notice.variant} title={notice.title}>
            {notice.description}
          </Alert>
        ) : null}

        {filterHackathonSlug !== undefined ? (
          <Alert variant="warning" title={dict.campList?.filterTitle || "Hackathon filter"}>
            {activeHackathon !== undefined
              ? `${dict.campList?.filterDesc || "Showing posts for"} ${activeHackathon.title} (${activeHackathon.slug})`
              : `${dict.campList?.filterDesc || "Showing posts for"} ${filterHackathonSlug}`}
          </Alert>
        ) : null}

        {isComposerOpen ? (
          <div className="space-y-8 animate-fade-in">
            <ActionGate
              isAllowed={profile !== null}
              title={dict.campForm?.createProfileTitle || "Profile required"}
              description={dict.campForm?.createProfileDesc || "You need a profile before creating a team post."}
            >
              <Card className="border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
                <CardHeader className="bg-[#f4f4f0] border-b-8 border-content-base">
                  <CardTitle className="text-4xl">{dict.campForm?.createTeamTitle || "Create a team"}</CardTitle>
                  <p className="text-xl font-bold text-content-subtle mt-4">
                    {dict.campForm?.postingAs || "Posting with your local profile:"} <span className="text-primary-base">{profile?.nickname}</span>
                  </p>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleCreateTeam} className="grid gap-8 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-3">
                      <label htmlFor="camp-team-name" className="text-xl font-black uppercase tracking-widest text-content-base">
                        {dict.campForm?.teamName || "Team name"}
                      </label>
                      <Input
                        id="camp-team-name"
                        value={teamName}
                        onChange={(event) => setTeamName(event.target.value)}
                        required
                        className="text-xl"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label htmlFor="camp-team-intro" className="text-xl font-black uppercase tracking-widest text-content-base">
                        {dict.campForm?.intro || "Introduction"}
                      </label>
                      <Textarea
                        id="camp-team-intro"
                        value={intro}
                        onChange={(event) => setIntro(event.target.value)}
                        required
                        className="text-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="camp-team-looking-for" className="text-xl font-black uppercase tracking-widest text-content-base">
                        {dict.campForm?.lookingFor || "Looking for"}
                      </label>
                      <Input
                        id="camp-team-looking-for"
                        value={lookingFor}
                        onChange={(event) => setLookingFor(event.target.value)}
                        placeholder={dict.campForm?.lookingForPlaceholder || "Frontend, Designer"}
                        className="text-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="camp-team-contact-url" className="text-xl font-black uppercase tracking-widest text-content-base">
                        {dict.campForm?.contactUrl || "Contact URL"}
                      </label>
                      <Input
                        id="camp-team-contact-url"
                        type="url"
                        value={contactUrl}
                        onChange={(event) => setContactUrl(event.target.value)}
                        placeholder="https://"
                        className="text-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="camp-team-hackathon" className="text-xl font-black uppercase tracking-widest text-content-base">
                        {dict.campForm?.hackathonSlug || "Hackathon"}
                      </label>
                      <Select
                        id="camp-team-hackathon"
                        value={teamHackathonSlug}
                        onChange={(event) => setTeamHackathonSlug(event.target.value)}
                        className="text-xl bg-[#f4f4f0]"
                      >
                        <option value="">{dict.campForm?.hackathonNone || "No linked hackathon"}</option>
                        {hackathons.map((hackathon) => (
                          <option key={hackathon.slug} value={hackathon.slug}>
                            {hackathon.title}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="flex items-center gap-4 border-4 border-content-base bg-white px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Checkbox
                        id="camp-team-open"
                        checked={isOpen}
                        onChange={(event) => setIsOpen(event.target.checked)}
                      />
                      <label htmlFor="camp-team-open" className="text-xl font-black uppercase tracking-widest text-content-base cursor-pointer">
                        {dict.campForm?.isOpen || "Currently recruiting"}
                      </label>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap justify-end gap-6 pt-8 border-t-4 border-content-base mt-4">
                      <Button type="button" variant="outline" onClick={resetComposer} className="h-16 px-10 text-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {dict.campForm?.reset || "Reset"}
                      </Button>
                      <Button type="submit" variant="brutal" className="h-16 px-10 text-xl bg-primary-base text-white border-content-base">
                        {dict.campForm?.submit || "Create team post"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </ActionGate>

            {profile === null ? (
              <Card className="max-w-xl mx-auto border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 rotate-[1deg]">
                <CardHeader className="bg-transparent border-b-4 border-content-base">
                  <CardTitle className="text-3xl">{dict.campForm?.createProfileBtn || "Create profile"}</CardTitle>
                  <p className="text-lg font-bold text-content-base mt-2">
                    {dict.campForm?.profileHint || "Only a nickname is stored in this browser."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 bg-white">
                  <div className="space-y-2">
                    <label htmlFor="camp-profile-nickname" className="text-xl font-black uppercase tracking-widest text-content-base">
                      {dict.campForm?.createProfileInputLabel || "Nickname"}
                    </label>
                    <Input
                      id="camp-profile-nickname"
                      placeholder={dict.campForm?.createProfileInputPlaceholder || "Nickname"}
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      className="text-xl"
                    />
                  </div>
                  <Button className="w-full h-16 text-xl bg-primary-base text-white border-4 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase font-black tracking-widest" onClick={handleCreateProfile}>
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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeams.map((team) => (
              <Card key={team.teamCode} className="h-full flex flex-col group border-4 border-content-base shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="space-y-4 bg-[#f4f4f0] border-b-4 border-content-base group-hover:bg-yellow-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-2xl">{team.name}</CardTitle>
                    <span
                      className={cn(
                        "rounded-none border-2 border-content-base px-3 py-1 text-sm font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                        team.isOpen
                          ? "bg-green-400 text-content-base"
                          : "bg-white text-content-subtle",
                      )}
                    >
                      {team.isOpen
                        ? dict.campList?.statusOpen || "Open"
                        : dict.campList?.statusClosed || "Closed"}
                    </span>
                  </div>
                  {team.ownerNicknameSnapshot !== undefined ? (
                    <p className="text-base font-bold text-content-subtle">
                      {dict.campList?.ownerLabel || "Owner"}: <span className="text-content-base">{team.ownerNicknameSnapshot}</span>
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-6 pt-6 flex-1 flex flex-col bg-white">
                  <p className="text-lg font-bold leading-relaxed text-content-base flex-1">{team.intro}</p>

                  <dl className="space-y-4 text-base pt-4 border-t-4 border-content-base mt-4">
                    {team.hackathonSlug !== undefined ? (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="font-black uppercase tracking-widest text-content-subtle">{dict.campList?.hackathonLabel || "Hackathon"}</dt>
                        <dd className="text-right font-bold text-content-base truncate max-w-[150px]">{team.hackathonSlug}</dd>
                      </div>
                    ) : null}

                    {team.lookingFor.length > 0 ? (
                      <div className="space-y-3">
                        <dt className="font-black uppercase tracking-widest text-content-subtle">{dict.campList?.lookingForLabel || "Looking for"}</dt>
                        <dd className="flex flex-wrap gap-2">
                          {team.lookingFor.map((role) => (
                            <span
                              key={`${team.teamCode}-${role}`}
                              className="border-2 border-content-base bg-blue-100 px-3 py-1 text-sm font-black text-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              {role}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}

                    {team.contact.url.length > 0 ? (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="font-black uppercase tracking-widest text-content-subtle">{dict.campList?.contactLabel || "Contact"}</dt>
                        <dd className="text-right">
                          <a
                            href={team.contact.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-black text-primary-base hover:underline decoration-4 underline-offset-4"
                          >
                            {dict.campList?.contactLink || "Open link"}
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-black uppercase tracking-widest text-content-subtle">{dict.campList?.createdAtLabel || "Created"}</dt>
                      <dd className="text-right font-bold text-content-base">
                        {dateFormatter.format(new Date(team.createdAt))}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

