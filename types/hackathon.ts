export type HackathonStatus = "upcoming" | "ongoing" | "ended";

export interface HackathonPeriod {
  timezone: string;
  submissionDeadlineAt?: string;
  endAt?: string;
  startAt?: string;
}

export interface HackathonLinks {
  detail: string;
  rules?: string;
  faq?: string;
}

export interface HackathonSummary {
  slug: string;
  title: string;
  status: HackathonStatus;
  tags: string[];
  thumbnailUrl?: string;
  period: HackathonPeriod;
  links: HackathonLinks;
}

export interface HackathonTeamPolicy {
  allowSolo?: boolean;
  maxTeamSize?: number;
}

export interface HackathonInfoLinks {
  rules?: string;
  faq?: string;
}

export interface HackathonEvalBreakdownItem {
  key: string;
  label: string;
  weightPercent: number;
}

export interface HackathonMilestone {
  name: string;
  at: string;
}

export interface HackathonPrizeItem {
  place: string;
  amountKRW: number;
}

export interface HackathonSubmissionItem {
  key: string;
  title: string;
  format: string;
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview?: {
      summary?: string;
      teamPolicy?: HackathonTeamPolicy;
    };
    info?: {
      notice?: string[];
      links?: HackathonInfoLinks;
    };
    eval?: {
      metricName?: string;
      description?: string;
      scoreSource?: string;
      scoreDisplay?: {
        label?: string;
        breakdown?: HackathonEvalBreakdownItem[];
      };
      limits?: {
        maxRuntimeSec?: number;
        maxSubmissionsPerDay?: number;
      };
    };
    schedule?: {
      timezone?: string;
      milestones?: HackathonMilestone[];
    };
    prize?: {
      items?: HackathonPrizeItem[];
    };
    teams?: {
      campEnabled?: boolean;
      listUrl?: string;
    };
    submit?: {
      allowedArtifactTypes?: string[];
      submissionUrl?: string;
      guide?: string[];
      submissionItems?: HackathonSubmissionItem[];
    };
    leaderboard?: {
      publicLeaderboardUrl?: string;
      note?: string;
    };
  };
}
