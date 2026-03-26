"use client";

import { useState } from "react";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Checkbox } from "@/components/design-system/primitives/Checkbox";
import { Input } from "@/components/design-system/primitives/Input";
import { Select } from "@/components/design-system/primitives/Select";
import { Textarea } from "@/components/design-system/primitives/Textarea";
import { Modal } from "@/components/design-system/patterns/Modal";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { createLocalTeamCode } from "@/lib/ids/local";
import { createLocalProfile, saveLocalProfile } from "@/lib/profile/localProfile";
import type { HackathonSummary, TeamPost } from "@/types";

interface CampWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ReturnType<typeof createLocalProfile> | null;
  onProfileUpdate: (profile: ReturnType<typeof createLocalProfile>) => void;
  onSubmit: (team: TeamPost) => { ok: true } | { ok: false; title: string; description: string };
  hackathons: HackathonSummary[];
  initialHackathonSlug?: string;
}

type InlineNotice = {
  title: string;
  description: string;
};

function parseRoles(value: string) {
  return value
    .split(",")
    .map((role) => role.trim())
    .filter((role) => role.length > 0);
}

// Custom Icons
const UserIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export function CampWizardModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
  onSubmit,
  hackathons,
  initialHackathonSlug,
}: CampWizardModalProps) {
  const { dict } = useI18n();
  const normalizedInitialHackathonSlug = initialHackathonSlug !== undefined
    && hackathons.some((hackathon) => hackathon.slug === initialHackathonSlug)
    ? initialHackathonSlug
    : "";

  const [step, setStep] = useState(profile ? 2 : 1);
  const [inlineNotice, setInlineNotice] = useState<InlineNotice | null>(null);
  
  const [nickname, setNickname] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamHackathonSlug, setTeamHackathonSlug] = useState(normalizedInitialHackathonSlug);
  const [intro, setIntro] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [isTeamOpen, setIsTeamOpen] = useState(true);

  const handleNext = () => {
    setInlineNotice(null);

    if (step === 1) {
      if (!profile) {
        const nextNickname = nickname.trim();
        if (nextNickname.length === 0) return;
        
        const nextProfile = createLocalProfile(nextNickname);
        if (!saveLocalProfile(nextProfile)) {
          setInlineNotice({
            title: dict.campForm?.createProfileErrorTitle || "Unable to save profile",
            description: dict.campForm?.createProfileErrorDesc || "Please try again.",
          });
          return;
        }

        onProfileUpdate(nextProfile);
      }
      setStep(2);
    } else if (step === 2) {
      if (teamName.trim().length === 0) return;
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 2 && profile) {
        return;
      }
      setInlineNotice(null);
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (step < 3) {
      handleNext();
      return;
    }

    if (!profile) return;

    const nextName = teamName.trim();
    const nextIntro = intro.trim();
    const nextHackathonSlug = teamHackathonSlug.length > 0
      && hackathons.some((hackathon) => hackathon.slug === teamHackathonSlug)
      ? teamHackathonSlug
      : undefined;

    if (nextName.length === 0 || nextIntro.length === 0) return;

    const createdAt = new Date().toISOString();
    const nextTeam: TeamPost = {
      teamCode: createLocalTeamCode(),
      hackathonSlug: nextHackathonSlug,
      ownerProfileId: profile.id,
      ownerNicknameSnapshot: profile.nickname,
      name: nextName,
      isOpen: isTeamOpen,
      lookingFor: parseRoles(lookingFor),
      intro: nextIntro,
      contact: {
        type: "link",
        url: contactUrl.trim(),
      },
      createdAt,
    };

    const result = onSubmit(nextTeam);

    if (!result.ok) {
      setInlineNotice({
        title: result.title,
        description: result.description,
      });
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
      className="max-w-[600px] overflow-visible"
    >
      <div className="pt-2 pb-6">
        {/* Header Section inside body for better control */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            {dict.campForm?.createTeamTitle || "Create a Team"}
          </h2>
          <p className="text-slate-500 text-sm">
            {step === 1 && "Start by setting up your public profile for this browser."}
            {step === 2 && "Give your team a name and optionally link it to a hackathon."}
            {step === 3 && "Tell others about your team, who you're looking for, and how to reach out."}
          </p>
        </div>

        {/* Beautiful Stepper */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-600 -z-10 transition-all duration-500 ease-in-out" 
            style={{ width: `${(step - 1) * 50}%` }}
          />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                  i === step 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-50" 
                    : i < step 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {i < step ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i
                )}
              </div>
            </div>
          ))}
        </div>

        {inlineNotice !== null ? (
          <Alert variant="danger" title={inlineNotice.title} className="mb-6 !rounded-xl !border !border-red-200 !bg-red-50 !p-4 !text-red-900 shadow-sm animate-in slide-in-from-top-2">
            {inlineNotice.description}
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
              <div className="space-y-2">
                <label htmlFor="wizard-nickname" className="text-sm font-semibold text-slate-700 ml-1">
                  {dict.campForm?.createProfileInputLabel || "Nickname"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <Input
                    id="wizard-nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={dict.campForm?.createProfileInputPlaceholder || "e.g. CodeNinja"}
                    required
                    className="pl-11 h-12 text-base bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 ml-1">
                  {dict.campForm?.profileHint || "Only a nickname is stored in this browser. You can change it later."}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
              <div className="space-y-2">
                <label htmlFor="wizard-team-name" className="text-sm font-semibold text-slate-700 ml-1">
                  {dict.campForm?.teamName || "Team Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UsersIcon />
                  </div>
                  <Input
                    id="wizard-team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    autoFocus
                    placeholder="e.g. Syntax Sorcerers"
                    className="pl-11 h-12 text-base bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="wizard-hackathon" className="text-sm font-semibold text-slate-700 ml-1">
                  {dict.campForm?.hackathonSlug || "Link to Hackathon (Optional)"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <BriefcaseIcon />
                  </div>
                  <Select
                    id="wizard-hackathon"
                    value={teamHackathonSlug}
                    onChange={(e) => setTeamHackathonSlug(e.target.value)}
                    className="pl-11 h-12 text-base bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm transition-all"
                  >
                    <option value="">{dict.campForm?.hackathonNone || "No linked hackathon"}</option>
                    {hackathons.map((h) => (
                      <option key={h.slug} value={h.slug}>{h.title}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
              <div className="space-y-2">
                <label htmlFor="wizard-intro" className="text-sm font-semibold text-slate-700 ml-1">
                  {dict.campForm?.intro || "Introduction"}
                </label>
                <Textarea
                  id="wizard-intro"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  required
                  autoFocus
                  placeholder="Describe your project, goals, and tech stack..."
                  className="text-base bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm min-h-[120px] p-4 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="wizard-looking-for" className="text-sm font-semibold text-slate-700 ml-1">
                    {dict.campForm?.lookingFor || "Looking for"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <Input
                      id="wizard-looking-for"
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      placeholder={dict.campForm?.lookingForPlaceholder || "Frontend, Designer"}
                      className="pl-11 h-12 text-sm bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="wizard-contact" className="text-sm font-semibold text-slate-700 ml-1">
                    {dict.campForm?.contactUrl || "Contact URL"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <LinkIcon />
                    </div>
                    <Input
                      id="wizard-contact"
                      type="url"
                      value={contactUrl}
                      onChange={(e) => setContactUrl(e.target.value)}
                      placeholder="https://"
                      className="pl-11 h-12 text-sm bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label 
                  htmlFor="wizard-open" 
                  className="flex items-center gap-4 border border-slate-200 rounded-2xl bg-white p-4 cursor-pointer hover:bg-slate-50 transition-all shadow-sm group"
                >
                  <div className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full shadow-inner ${isTeamOpen ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm ${isTeamOpen ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </div>
                  <Checkbox
                    id="wizard-open"
                    checked={isTeamOpen}
                    onChange={(e) => setIsTeamOpen(e.target.checked)}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {dict.campForm?.isOpen || "Currently recruiting"}
                    </span>
                    <span className="text-xs text-slate-500">
                      Toggle if you are actively looking for members
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || (step === 2 && !!profile)}
              className="px-6 h-12 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {dict.campForm?.prevStep || "Back"}
            </button>

            <button
              type="submit"
              className="px-8 h-12 text-sm font-semibold rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all focus:ring-4 focus:ring-slate-900/10 focus:outline-none"
            >
              {step < 3 ? (dict.campForm?.nextStep || "Continue") : (dict.campForm?.submit || "Launch Team")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
