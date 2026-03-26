"use client";

import { useState } from "react";
import { Alert } from "@/components/design-system/primitives/Alert";
import { Button } from "@/components/design-system/primitives/Button";
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

  const stepTitle = step === 1 ? dict.campForm?.stepProfile || "Profile Setup" 
    : step === 2 ? dict.campForm?.stepBasic || "Basic Info"
    : dict.campForm?.stepDetails || "Details";

  const stepProgressStr = (dict.campForm?.stepProgress || "Step {current} of {total}")
    .replace("{current}", String(step))
    .replace("{total}", "3");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${dict.campForm?.createTeamTitle || "Create a Team"} - ${stepTitle}`}
      closeLabel={dict.campForm?.closeModal || "Close modal"}
      className="max-w-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-12 rounded-full transition-colors ${
                i === step ? "bg-blue-600" : i < step ? "bg-blue-200" : "bg-slate-100"
              }`}
            />
          ))}
        </div>
        <div className="text-sm font-medium text-slate-500">
          {stepProgressStr}
        </div>
      </div>

      {inlineNotice !== null ? (
        <Alert variant="danger" title={inlineNotice.title} className="mb-6 !rounded-xl !border !border-red-200 !bg-red-50 !p-4 !text-red-900 hover:!translate-y-0 hover:!shadow-sm">
          {inlineNotice.description}
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
              <label htmlFor="wizard-nickname" className="text-sm font-semibold text-slate-700 block ml-1">
                {dict.campForm?.createProfileInputLabel || "Nickname"}
              </label>
              <Input
                id="wizard-nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={dict.campForm?.createProfileInputPlaceholder || "Nickname"}
                required
                className="text-sm bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm h-10 px-3"
              />
              <p className="text-xs text-slate-500 ml-1 mt-1">
                {dict.campForm?.profileHint || "Only a nickname is stored in this browser."}
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
              <label htmlFor="wizard-team-name" className="text-sm font-semibold text-slate-700 block ml-1">
                {dict.campForm?.teamName || "Team Name"}
              </label>
              <Input
                id="wizard-team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                autoFocus
                className="text-sm bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm h-10 px-3"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="wizard-hackathon" className="text-sm font-semibold text-slate-700 block ml-1">
                {dict.campForm?.hackathonSlug || "Hackathon"}
              </label>
              <Select
                id="wizard-hackathon"
                value={teamHackathonSlug}
                onChange={(e) => setTeamHackathonSlug(e.target.value)}
                className="text-sm bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm h-10 px-3"
              >
                <option value="">{dict.campForm?.hackathonNone || "No linked hackathon"}</option>
                {hackathons.map((h) => (
                  <option key={h.slug} value={h.slug}>{h.title}</option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
              <label htmlFor="wizard-intro" className="text-sm font-semibold text-slate-700 block ml-1">
                {dict.campForm?.intro || "Introduction"}
              </label>
              <Textarea
                id="wizard-intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                required
                autoFocus
                className="text-sm bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm min-h-[96px] p-3"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="wizard-looking-for" className="text-sm font-semibold text-slate-700 block ml-1">
                {dict.campForm?.lookingFor || "Looking for"}
              </label>
              <Input
                id="wizard-looking-for"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder={dict.campForm?.lookingForPlaceholder || "Frontend, Designer"}
                className="text-sm bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm h-10 px-3"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="wizard-contact" className="text-sm font-semibold text-slate-700 block ml-1">
                {dict.campForm?.contactUrl || "Contact URL"}
              </label>
              <Input
                id="wizard-contact"
                type="url"
                value={contactUrl}
                onChange={(e) => setContactUrl(e.target.value)}
                placeholder="https://"
                className="text-sm bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm h-10 px-3"
              />
            </div>

            <div className="flex items-center gap-3 border border-slate-200/80 rounded-2xl bg-slate-50/50 px-4 py-2 h-10 shadow-sm">
              <Checkbox
                id="wizard-open"
                checked={isTeamOpen}
                onChange={(e) => setIsTeamOpen(e.target.checked)}
                className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-600/20"
              />
              <label htmlFor="wizard-open" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                {dict.campForm?.isOpen || "Currently recruiting"}
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || (step === 2 && !!profile)}
            className="h-10 px-5 text-sm font-medium rounded-full"
          >
            {dict.campForm?.prevStep || "Back"}
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="h-10 px-6 text-sm font-semibold rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            {step < 3 ? (dict.campForm?.nextStep || "Next") : (dict.campForm?.submit || "Create Team")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
