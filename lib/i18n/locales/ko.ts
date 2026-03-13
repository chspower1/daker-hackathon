import type { Dictionary } from "./en";

export const ko: Dictionary = {
  metadata: {
    title: "해커톤 플랫폼 | 빌드, 경쟁, 창조",
    description:
      "이벤트를 찾고, 팀을 만들고, 랭킹을 확인할 수 있는 캐주얼 해커톤 플랫폼입니다.",
  },
  languageSwitcher: {
    label: "언어 선택기",
    english: "영어로 전환",
    korean: "한국어로 전환",
  },
  hero: {
    headline: "빌드. 경쟁. 창조.",
    subcopy: "아이디어가 현실이 되는 캐주얼 해커톤 플랫폼입니다. 이벤트를 발견하고, 드림팀을 구축하며, 랭킹을 올려보세요.",
    primaryCta: {
      label: "해커톤 탐색하기",
      href: "#discover"
    },
    secondaryCta: {
      label: "팀 찾기",
      href: "#team"
    }
  },
  flow: [
    {
      step: "01",
      title: "탐색",
      description: "당신의 기술과 관심사에 맞는 해커톤을 찾아보세요."
    },
    {
      step: "02",
      title: "팀 빌딩",
      description: "같은 목표를 가진 크리에이터들과 연결되어 팀을 구성하세요."
    },
    {
      step: "03",
      title: "랭킹 올리기",
      description: "프로젝트를 제출하고 포인트를 얻어 글로벌 리더보드에 이름을 올리세요."
    }
  ],
  features: [
    {
      id: "discover",
      title: "이벤트 탐색",
      description: "전 세계의 선별된 해커톤을 살펴보세요. 초보자든 전문가든, 여러분을 위한 도전이 기다리고 있습니다.",
      color: "bg-blue-500"
    },
    {
      id: "team",
      title: "팀 구축",
      description: "혼자서 해커톤에 참여하지 마세요. 매칭 시스템을 통해 당신의 스킬을 보완해 줄 개발자, 디자이너, 기획자를 찾아줍니다.",
      color: "bg-purple-500"
    },
    {
      id: "rankings",
      title: "글로벌 랭킹",
      description: "업적을 달성하고 리더보드에 오르세요. 전 세계에 당신의 기술을 선보이고 포트폴리오를 만들어보세요.",
      color: "bg-pink-500"
    },
    {
      id: "host",
      title: "개최 및 후원",
      description: "강력한 주최자 도구로 나만의 해커톤을 운영해 보세요. (출시 예정)",
      color: "bg-orange-500"
    }
  ],
  rankingsPreview: [
    { rank: 1, team: "네온 나이츠", score: 2450, status: "활동중" },
    { rank: 2, team: "사이버 신디케이트", score: 2310, status: "활동중" },
    { rank: 3, team: "퀀텀 코더스", score: 2180, status: "활동중" },
    { rank: 4, team: "바이트 브롤러스", score: 1950, status: "활동중" },
  ],
  footer: {
    headline: "빌드할 준비가 되셨나요?",
    cta: {
      label: "플랫폼 참여하기",
      href: "#discover"
    }
  },
  nav: {
    discover: "탐색",
    teams: "팀",
    rankings: "랭킹",
    getStarted: "시작하기",
  },
  card: {
    live: "진행중",
    lookingForTeam: "팀원 모집중",
    globalAIHack: "글로벌 AI 해커톤",
    globalAIHackDesc: "AI 툴의 미래를 구축하는 500명 이상의 해커들과 함께하세요.",
    frontendDev: "프론트엔드 개발자",
    frontendDevDesc: "React, Tailwind, Motion.",
    leaderboard: "리더보드",
    teamAlpha: "알파 팀",
  },
  misc: {
    welcome: "새로운 무대에 오신 것을 환영합니다",
    featuresTitle: "필요한 모든 것",
    featuresSubtitle: "속도, 협업, 그리고 최고의 작업물을 선보이기 위해 설계된 플랫폼입니다.",
    learnMore: "더 알아보기 →",
    rankingsBadge: "실시간 랭킹",
    rankingsTitle: "이번 시즌 최고의 팀",
    tableRank: "순위",
    tableTeam: "팀명",
    tableScore: "점수",
    tableStatus: "상태",
    viewFull: "전체 리더보드 보기",
    rights: "HackPlatform. 모든 권리 보유.",
    host: "개최",
  },
};
