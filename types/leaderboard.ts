export type LeaderboardStatus = "submitted" | "unsubmitted";

export interface LeaderboardArtifacts {
  webUrl?: string;
  pdfUrl?: string;
  planTitle?: string;
}

export interface LeaderboardEntry {
  rank?: number;
  teamName: string;
  score?: number;
  submittedAt?: string;
  scoreBreakdown?: Record<string, number>;
  artifacts?: LeaderboardArtifacts;
  status?: LeaderboardStatus;
}

export interface Leaderboard {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}
