export type SubmissionStatus = "draft" | "submitted";

export interface SubmissionRecord {
  id: string;
  hackathonSlug: string;
  profileId?: string;
  profileNicknameSnapshot?: string;
  teamName: string;
  status: SubmissionStatus;
  notes?: string;
  artifacts: Record<string, string>;
  submittedAt?: string;
  updatedAt: string;
}
