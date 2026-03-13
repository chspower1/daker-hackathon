export interface TeamContact {
  type: "link";
  url: string;
}

export interface TeamPost {
  teamCode: string;
  hackathonSlug?: string;
  ownerProfileId?: string;
  ownerNicknameSnapshot?: string;
  name: string;
  isOpen: boolean;
  memberCount?: number;
  lookingFor: string[];
  intro: string;
  contact: TeamContact;
  createdAt: string;
}
