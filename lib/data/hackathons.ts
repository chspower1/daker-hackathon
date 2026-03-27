import publicHackathonDetail from "@/docs/requirements/예시자료/public_hackathon_detail.json";
import publicHackathons from "@/docs/requirements/예시자료/public_hackathons.json";
import type { HackathonDetail, HackathonSummary } from "@/types";

const additionalHackathons: HackathonSummary[] = [
  {
    slug: "climate-ai-sprint-2026-04",
    title: "기후테크 AI 스프린트 2026",
    status: "upcoming",
    tags: ["Climate", "AI", "Data"],
    thumbnailUrl: "https://example.com/public/img/climate-ai-sprint-202604.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2026-04-10T10:00:00+09:00",
      submissionDeadlineAt: "2026-04-17T18:00:00+09:00",
      endAt: "2026-04-19T18:00:00+09:00",
    },
    links: {
      detail: "/hackathons/climate-ai-sprint-2026-04",
      rules: "https://example.com/public/rules/climate-ai-sprint-202604",
      faq: "https://example.com/public/faq/climate-ai-sprint-202604",
    },
  },
  {
    slug: "campus-builder-weekend-2026-04",
    title: "캠퍼스 빌더 위켄드 : 학생 서비스 MVP 해커톤",
    status: "ongoing",
    tags: ["Campus", "Web", "MVP"],
    thumbnailUrl: "https://example.com/public/img/campus-builder-weekend-202604.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2026-04-04T09:00:00+09:00",
      submissionDeadlineAt: "2026-04-12T21:00:00+09:00",
      endAt: "2026-04-13T12:00:00+09:00",
    },
    links: {
      detail: "/hackathons/campus-builder-weekend-2026-04",
      rules: "https://example.com/public/rules/campus-builder-weekend-202604",
      faq: "https://example.com/public/faq/campus-builder-weekend-202604",
    },
  },
  {
    slug: "gov-data-viz-challenge-2026-01",
    title: "공공데이터 시각화 챌린지 2026",
    status: "ended",
    tags: ["DataViz", "PublicData", "Dashboard"],
    thumbnailUrl: "https://example.com/public/img/gov-data-viz-202601.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2026-01-08T10:00:00+09:00",
      submissionDeadlineAt: "2026-01-21T18:00:00+09:00",
      endAt: "2026-01-24T16:00:00+09:00",
    },
    links: {
      detail: "/hackathons/gov-data-viz-challenge-2026-01",
      rules: "https://example.com/public/rules/gov-data-viz-202601",
      faq: "https://example.com/public/faq/gov-data-viz-202601",
    },
  },
  {
    slug: "multimodal-safety-jam-2026-05",
    title: "멀티모달 안전성 점검 잼 2026",
    status: "upcoming",
    tags: ["Multimodal", "Safety", "Evaluation"],
    thumbnailUrl: "https://example.com/public/img/multimodal-safety-jam-202605.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2026-05-14T10:00:00+09:00",
      submissionDeadlineAt: "2026-05-22T17:00:00+09:00",
      endAt: "2026-05-24T17:00:00+09:00",
    },
    links: {
      detail: "/hackathons/multimodal-safety-jam-2026-05",
      rules: "https://example.com/public/rules/multimodal-safety-jam-202605",
      faq: "https://example.com/public/faq/multimodal-safety-jam-202605",
    },
  },
  {
    slug: "edge-agentics-hack-night-2026-03",
    title: "엣지 에이전틱스 해크 나이트",
    status: "ongoing",
    tags: ["Agents", "Edge", "IoT"],
    thumbnailUrl: "https://example.com/public/img/edge-agentics-hack-night-202603.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2026-03-20T18:00:00+09:00",
      submissionDeadlineAt: "2026-03-29T23:00:00+09:00",
      endAt: "2026-03-30T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/edge-agentics-hack-night-2026-03",
      rules: "https://example.com/public/rules/edge-agentics-hack-night-202603",
      faq: "https://example.com/public/faq/edge-agentics-hack-night-202603",
    },
  },
  {
    slug: "social-impact-ai-week-2026-06",
    title: "소셜 임팩트 AI 위크 해커톤",
    status: "upcoming",
    tags: ["SocialImpact", "LLM", "Accessibility"],
    thumbnailUrl: "https://example.com/public/img/social-impact-ai-week-202606.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2026-06-05T10:00:00+09:00",
      submissionDeadlineAt: "2026-06-12T18:00:00+09:00",
      endAt: "2026-06-14T18:00:00+09:00",
    },
    links: {
      detail: "/hackathons/social-impact-ai-week-2026-06",
      rules: "https://example.com/public/rules/social-impact-ai-week-202606",
      faq: "https://example.com/public/faq/social-impact-ai-week-202606",
    },
  },
  {
    slug: "creator-tools-hackfest-2025-12",
    title: "크리에이터 툴즈 해크페스트 2025",
    status: "ended",
    tags: ["Creator", "Video", "Automation"],
    thumbnailUrl: "https://example.com/public/img/creator-tools-hackfest-202512.png",
    period: {
      timezone: "Asia/Seoul",
      startAt: "2025-12-05T10:00:00+09:00",
      submissionDeadlineAt: "2025-12-14T17:00:00+09:00",
      endAt: "2025-12-16T12:00:00+09:00",
    },
    links: {
      detail: "/hackathons/creator-tools-hackfest-2025-12",
      rules: "https://example.com/public/rules/creator-tools-hackfest-202512",
      faq: "https://example.com/public/faq/creator-tools-hackfest-202512",
    },
  },
];

const additionalHackathonDetails: HackathonDetail[] = [
  {
    slug: "monthly-vibe-coding-2026-02",
    title: "월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)",
    sections: {
      overview: {
        summary: "생성형 AI 기반 바이브 코딩 경험을 더 빠르고 정확하게 만드는 아이디어를 제안하고 검증하는 공모형 해커톤입니다.",
        teamPolicy: {
          allowSolo: true,
          maxTeamSize: 4,
        },
      },
      info: {
        notice: [
          "문제 정의와 기대 효과가 명확한 아이디어를 우선 평가합니다.",
          "아이디어 소개 자료와 데모 링크는 제출 시 함께 입력해야 합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/vibe202602",
          faq: "https://example.com/public/faq/vibe202602",
        },
      },
      eval: {
        metricName: "ImpactScore",
        description: "문제 정의, 실행 가능성, 확장성을 종합 평가한 점수입니다.",
        scoreSource: "judge",
        scoreDisplay: {
          label: "심사 점수",
          breakdown: [
            {
              key: "problem",
              label: "문제 정의",
              weightPercent: 40,
            },
            {
              key: "execution",
              label: "실행 가능성",
              weightPercent: 35,
            },
            {
              key: "scale",
              label: "확장성",
              weightPercent: 25,
            },
          ],
        },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "아이디어 제안서 제출 시작",
            at: "2026-02-24T10:00:00+09:00",
          },
          {
            name: "아이디어 제안서 제출 마감",
            at: "2026-03-03T10:00:00+09:00",
          },
          {
            name: "결과 발표",
            at: "2026-03-09T10:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 1500000,
          },
          {
            place: "2nd",
            amountKRW: 700000,
          },
          {
            place: "3rd",
            amountKRW: 300000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=monthly-vibe-coding-2026-02",
      },
      submit: {
        allowedArtifactTypes: ["text", "url"],
        submissionUrl: "/hackathons/monthly-vibe-coding-2026-02#submit",
        guide: [
          "문제 정의, 제안 솔루션, 기대 효과를 간단히 정리합니다.",
          "프로토타입이나 참고 화면이 있다면 URL로 함께 제출합니다.",
        ],
        submissionItems: [
          {
            key: "plan",
            title: "아이디어 설명",
            format: "text_or_url",
          },
          {
            key: "demo",
            title: "프로토타입 또는 참고 링크",
            format: "url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/monthly-vibe-coding-2026-02#leaderboard",
        note: "아이디어형 해커톤이므로 점수는 심사 기준에 맞춰 비공개 검토 후 반영됩니다.",
      },
    },
  },
  {
    slug: "climate-ai-sprint-2026-04",
    title: "기후테크 AI 스프린트 2026",
    sections: {
      overview: {
        summary: "에너지 사용량과 탄소 배출 데이터를 분석해 실질적인 감축 시나리오를 제안하는 실전형 해커톤입니다.",
        teamPolicy: {
          allowSolo: false,
          maxTeamSize: 5,
        },
      },
      info: {
        notice: [
          "제공 데이터 외 외부 공개 데이터를 추가로 활용할 수 있습니다.",
          "제출물에는 분석 결과와 실행 계획이 함께 포함되어야 합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/climate-ai-sprint-202604",
          faq: "https://example.com/public/faq/climate-ai-sprint-202604",
        },
      },
      eval: {
        metricName: "ClimateImpactScore",
        description: "문제 해결력, 데이터 활용도, 실행 가능성을 합산한 점수입니다.",
        scoreSource: "judge",
        scoreDisplay: {
          label: "심사 점수",
          breakdown: [
            {
              key: "impact",
              label: "감축 효과",
              weightPercent: 40,
            },
            {
              key: "analysis",
              label: "데이터 분석",
              weightPercent: 35,
            },
            {
              key: "delivery",
              label: "실행 계획",
              weightPercent: 25,
            },
          ],
        },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "문제 브리핑",
            at: "2026-04-10T10:00:00+09:00",
          },
          {
            name: "중간 점검",
            at: "2026-04-15T14:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2026-04-17T18:00:00+09:00",
          },
          {
            name: "데모데이",
            at: "2026-04-19T14:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 4000000,
          },
          {
            place: "2nd",
            amountKRW: 2000000,
          },
          {
            place: "3rd",
            amountKRW: 1000000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=climate-ai-sprint-2026-04",
      },
      submit: {
        allowedArtifactTypes: ["url", "pdf"],
        submissionUrl: "/hackathons/climate-ai-sprint-2026-04#submit",
        guide: [
          "서비스 데모 URL과 발표 자료 PDF를 함께 제출합니다.",
          "활용한 데이터셋과 가정은 메모에 간단히 정리합니다.",
        ],
        submissionItems: [
          {
            key: "web",
            title: "데모 URL",
            format: "url",
          },
          {
            key: "pdf",
            title: "발표 자료",
            format: "pdf_url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/climate-ai-sprint-2026-04#leaderboard",
        note: "최종 리더보드는 발표 심사 종료 후 공개됩니다.",
      },
    },
  },
  {
    slug: "campus-builder-weekend-2026-04",
    title: "캠퍼스 빌더 위켄드 : 학생 서비스 MVP 해커톤",
    sections: {
      overview: {
        summary: "대학생이 직접 겪는 문제를 해결하는 서비스 MVP를 48시간 안에 설계하고 시연하는 해커톤입니다.",
        teamPolicy: {
          allowSolo: true,
          maxTeamSize: 5,
        },
      },
      info: {
        notice: [
          "학생 생활과 관련된 문제를 명확히 정의해야 합니다.",
          "완성도보다 빠른 검증과 사용자 피드백 반영을 중시합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/campus-builder-weekend-202604",
          faq: "https://example.com/public/faq/campus-builder-weekend-202604",
        },
      },
      eval: {
        metricName: "MVPScore",
        description: "문제 적합도, 사용자 검증, 시연 완성도를 기준으로 평가합니다.",
        scoreSource: "judge",
        limits: {
          maxSubmissionsPerDay: 3,
        },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "킥오프",
            at: "2026-04-04T09:00:00+09:00",
          },
          {
            name: "중간 발표",
            at: "2026-04-11T14:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2026-04-12T21:00:00+09:00",
          },
          {
            name: "시상식",
            at: "2026-04-13T12:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 2000000,
          },
          {
            place: "2nd",
            amountKRW: 1000000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=campus-builder-weekend-2026-04",
      },
      submit: {
        allowedArtifactTypes: ["url", "text"],
        submissionUrl: "/hackathons/campus-builder-weekend-2026-04#submit",
        guide: [
          "배포 가능한 MVP URL을 제출합니다.",
          "핵심 사용자 가설과 검증 결과를 메모에 남깁니다.",
        ],
        submissionItems: [
          {
            key: "web",
            title: "MVP URL",
            format: "url",
          },
          {
            key: "plan",
            title: "검증 메모",
            format: "text_or_url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/campus-builder-weekend-2026-04#leaderboard",
        note: "현장 발표 점수와 사용자 피드백 점수를 함께 반영합니다.",
      },
    },
  },
  {
    slug: "gov-data-viz-challenge-2026-01",
    title: "공공데이터 시각화 챌린지 2026",
    sections: {
      overview: {
        summary: "공공데이터를 읽기 쉬운 시각화와 대시보드로 전환해 사회적 이해를 돕는 데이터 해커톤입니다.",
        teamPolicy: {
          allowSolo: true,
          maxTeamSize: 4,
        },
      },
      info: {
        notice: [
          "사용한 데이터 출처를 명확히 표기해야 합니다.",
          "시각화의 해석 가능성과 접근성을 함께 평가합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/gov-data-viz-202601",
          faq: "https://example.com/public/faq/gov-data-viz-202601",
        },
      },
      eval: {
        metricName: "VizScore",
        description: "정보 전달력, 정확성, 시각 완성도를 기반으로 산정한 점수입니다.",
        scoreSource: "judge",
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "데이터셋 공개",
            at: "2026-01-08T10:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2026-01-21T18:00:00+09:00",
          },
          {
            name: "심사 결과 발표",
            at: "2026-01-24T16:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 1800000,
          },
          {
            place: "2nd",
            amountKRW: 900000,
          },
          {
            place: "3rd",
            amountKRW: 500000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=gov-data-viz-challenge-2026-01",
      },
      submit: {
        allowedArtifactTypes: ["url", "pdf"],
        submissionUrl: "/hackathons/gov-data-viz-challenge-2026-01#submit",
        guide: [
          "대시보드 URL 또는 시연 가능한 결과물을 제출합니다.",
          "분석 요약 PDF를 함께 첨부하면 가산점이 있습니다.",
        ],
        submissionItems: [
          {
            key: "web",
            title: "대시보드 URL",
            format: "url",
          },
          {
            key: "pdf",
            title: "분석 요약",
            format: "pdf_url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/gov-data-viz-challenge-2026-01#leaderboard",
        note: "접근성 점검을 통과한 제출물만 최종 순위에 반영됩니다.",
      },
    },
  },
  {
    slug: "multimodal-safety-jam-2026-05",
    title: "멀티모달 안전성 점검 잼 2026",
    sections: {
      overview: {
        summary: "텍스트·이미지 입력을 함께 다루는 모델의 안전성 취약점을 찾고 완화 전략을 제안하는 평가형 해커톤입니다.",
        teamPolicy: {
          allowSolo: false,
          maxTeamSize: 5,
        },
      },
      info: {
        notice: [
          "공격 시나리오와 완화 방법을 모두 제출해야 합니다.",
          "유해 콘텐츠 생성 시 공개 범위를 고려해 캡처를 마스킹해야 합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/multimodal-safety-jam-202605",
          faq: "https://example.com/public/faq/multimodal-safety-jam-202605",
        },
      },
      eval: {
        metricName: "SafetyScore",
        description: "취약점 재현성, 완화 효과, 보고서 명확성을 평가합니다.",
        scoreSource: "judge",
        limits: {
          maxRuntimeSec: 900,
          maxSubmissionsPerDay: 5,
        },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "공격 시나리오 공개",
            at: "2026-05-14T10:00:00+09:00",
          },
          {
            name: "중간 Q&A",
            at: "2026-05-18T16:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2026-05-22T17:00:00+09:00",
          },
          {
            name: "리포트 공개",
            at: "2026-05-24T17:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 3500000,
          },
          {
            place: "2nd",
            amountKRW: 1700000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=multimodal-safety-jam-2026-05",
      },
      submit: {
        allowedArtifactTypes: ["url", "pdf", "text"],
        submissionUrl: "/hackathons/multimodal-safety-jam-2026-05#submit",
        guide: [
          "재현 가능한 공격 절차를 설명합니다.",
          "완화 후 결과 비교와 보고서 링크를 함께 제출합니다.",
        ],
        submissionItems: [
          {
            key: "plan",
            title: "재현 절차",
            format: "text_or_url",
          },
          {
            key: "pdf",
            title: "분석 리포트",
            format: "pdf_url",
          },
          {
            key: "web",
            title: "데모 또는 저장소 링크",
            format: "url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/multimodal-safety-jam-2026-05#leaderboard",
        note: "리더보드는 유효한 재현 절차를 제출한 팀만 표시합니다.",
      },
    },
  },
  {
    slug: "edge-agentics-hack-night-2026-03",
    title: "엣지 에이전틱스 해크 나이트",
    sections: {
      overview: {
        summary: "로컬 디바이스와 센서를 활용해 네트워크 의존도가 낮은 에이전트 워크플로를 구현하는 해커톤입니다.",
        teamPolicy: {
          allowSolo: true,
          maxTeamSize: 4,
        },
      },
      info: {
        notice: [
          "오프라인 환경에서도 핵심 시나리오가 동작해야 합니다.",
          "데모 영상 또는 실시간 시연 링크를 함께 제출해 주세요.",
        ],
        links: {
          rules: "https://example.com/public/rules/edge-agentics-hack-night-202603",
          faq: "https://example.com/public/faq/edge-agentics-hack-night-202603",
        },
      },
      eval: {
        metricName: "AgentRunScore",
        description: "오프라인 실행 안정성, 자동화 품질, 디바이스 활용도를 평가합니다.",
        scoreSource: "judge",
        limits: {
          maxRuntimeSec: 600,
        },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "킥오프 세션",
            at: "2026-03-20T18:00:00+09:00",
          },
          {
            name: "멘토 오피스아워",
            at: "2026-03-24T20:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2026-03-29T23:00:00+09:00",
          },
          {
            name: "결과 발표",
            at: "2026-03-30T10:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 2500000,
          },
          {
            place: "2nd",
            amountKRW: 1200000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=edge-agentics-hack-night-2026-03",
      },
      submit: {
        allowedArtifactTypes: ["url", "text"],
        submissionUrl: "/hackathons/edge-agentics-hack-night-2026-03#submit",
        guide: [
          "실행 시나리오 설명과 데모 링크를 함께 제출합니다.",
          "하드웨어 구성이 필요한 경우 메모에 장비 정보를 적어 주세요.",
        ],
        submissionItems: [
          {
            key: "web",
            title: "데모 링크",
            format: "url",
          },
          {
            key: "plan",
            title: "실행 시나리오",
            format: "text_or_url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/edge-agentics-hack-night-2026-03#leaderboard",
        note: "실제 동작 확인이 가능한 제출물에 한해 순위를 공개합니다.",
      },
    },
  },
  {
    slug: "social-impact-ai-week-2026-06",
    title: "소셜 임팩트 AI 위크 해커톤",
    sections: {
      overview: {
        summary: "접근성, 복지, 교육 등 사회 문제 해결에 초점을 맞춘 AI 서비스 프로토타입을 만드는 해커톤입니다.",
        teamPolicy: {
          allowSolo: false,
          maxTeamSize: 5,
        },
      },
      info: {
        notice: [
          "서비스 대상자와 기대 효과를 명확히 정의해야 합니다.",
          "접근성 고려 사항을 제출물에서 분명히 설명해야 합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/social-impact-ai-week-202606",
          faq: "https://example.com/public/faq/social-impact-ai-week-202606",
        },
      },
      eval: {
        metricName: "ImpactScore",
        description: "사회적 가치, 접근성, 실제 사용 가능성을 기준으로 평가합니다.",
        scoreSource: "judge",
        scoreDisplay: {
          label: "임팩트 점수",
          breakdown: [
            {
              key: "impact",
              label: "사회적 가치",
              weightPercent: 45,
            },
            {
              key: "accessibility",
              label: "접근성",
              weightPercent: 30,
            },
            {
              key: "execution",
              label: "실행 가능성",
              weightPercent: 25,
            },
          ],
        },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "참가팀 매칭",
            at: "2026-06-05T10:00:00+09:00",
          },
          {
            name: "멘토링 데이",
            at: "2026-06-09T14:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2026-06-12T18:00:00+09:00",
          },
          {
            name: "성과 발표",
            at: "2026-06-14T18:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 3000000,
          },
          {
            place: "2nd",
            amountKRW: 1500000,
          },
          {
            place: "3rd",
            amountKRW: 700000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=social-impact-ai-week-2026-06",
      },
      submit: {
        allowedArtifactTypes: ["url", "pdf"],
        submissionUrl: "/hackathons/social-impact-ai-week-2026-06#submit",
        guide: [
          "배포 URL과 문제 해결 시나리오 문서를 함께 제출합니다.",
          "접근성 검토 항목을 PDF 또는 메모로 정리해 주세요.",
        ],
        submissionItems: [
          {
            key: "web",
            title: "서비스 URL",
            format: "url",
          },
          {
            key: "pdf",
            title: "임팩트 요약 자료",
            format: "pdf_url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/social-impact-ai-week-2026-06#leaderboard",
        note: "사회적 가치 항목은 심사위원 코멘트와 함께 요약 공개될 수 있습니다.",
      },
    },
  },
  {
    slug: "creator-tools-hackfest-2025-12",
    title: "크리에이터 툴즈 해크페스트 2025",
    sections: {
      overview: {
        summary: "영상 제작, 배포, 자동화 도구를 빠르게 프로토타이핑해 크리에이터 생산성을 높이는 해커톤입니다.",
        teamPolicy: {
          allowSolo: true,
          maxTeamSize: 4,
        },
      },
      info: {
        notice: [
          "영상 편집, 자막, 배포 자동화 등 크리에이터 워크플로 중심 과제를 권장합니다.",
          "서비스 데모가 없더라도 명확한 자동화 흐름이 있어야 합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/creator-tools-hackfest-202512",
          faq: "https://example.com/public/faq/creator-tools-hackfest-202512",
        },
      },
      eval: {
        metricName: "CreatorScore",
        description: "생산성 개선 효과, 워크플로 연결성, 시연 완성도를 평가합니다.",
        scoreSource: "judge",
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          {
            name: "주제 공개",
            at: "2025-12-05T10:00:00+09:00",
          },
          {
            name: "최종 제출 마감",
            at: "2025-12-14T17:00:00+09:00",
          },
          {
            name: "쇼케이스",
            at: "2025-12-16T12:00:00+09:00",
          },
        ],
      },
      prize: {
        items: [
          {
            place: "1st",
            amountKRW: 2200000,
          },
          {
            place: "2nd",
            amountKRW: 1000000,
          },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=creator-tools-hackfest-2025-12",
      },
      submit: {
        allowedArtifactTypes: ["url", "pdf", "text"],
        submissionUrl: "/hackathons/creator-tools-hackfest-2025-12#submit",
        guide: [
          "데모 영상이나 서비스 링크를 제출합니다.",
          "어떤 제작 과정을 얼마나 단축했는지 메모에 설명해 주세요.",
        ],
        submissionItems: [
          {
            key: "web",
            title: "데모 링크",
            format: "url",
          },
          {
            key: "pdf",
            title: "쇼케이스 자료",
            format: "pdf_url",
          },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/creator-tools-hackfest-2025-12#leaderboard",
        note: "심사 종료 시점의 시연 품질과 워크플로 설명을 합산해 순위를 산정합니다.",
      },
    },
  },
];

function normalizeHackathonStatus(status: string): HackathonSummary["status"] {
  if (status === "upcoming" || status === "ongoing" || status === "ended") {
    return status;
  }

  return "upcoming";
}

function normalizeHackathonSummary(hackathon: (typeof publicHackathons)[number]): HackathonSummary {
  const startAt = "startAt" in hackathon.period && typeof hackathon.period.startAt === "string"
    ? hackathon.period.startAt
    : undefined;

  return {
    slug: hackathon.slug,
    title: hackathon.title,
    status: normalizeHackathonStatus(hackathon.status),
    tags: [...hackathon.tags],
    thumbnailUrl: hackathon.thumbnailUrl,
    period: {
      timezone: hackathon.period.timezone,
      submissionDeadlineAt: hackathon.period.submissionDeadlineAt,
      endAt: hackathon.period.endAt,
      startAt,
    },
    links: {
      detail: hackathon.links.detail,
      rules: hackathon.links.rules,
      faq: hackathon.links.faq,
    },
  };
}

const primaryHackathonDetail: HackathonDetail = {
  slug: publicHackathonDetail.slug,
  title: publicHackathonDetail.title,
  sections: publicHackathonDetail.sections,
};

const extraHackathonDetails: HackathonDetail[] = publicHackathonDetail.extraDetails.map((detail) => ({
  slug: detail.slug,
  title: detail.title,
  sections: detail.sections,
}));

const allHackathonDetails: HackathonDetail[] = [
  primaryHackathonDetail,
  ...extraHackathonDetails,
  ...additionalHackathonDetails,
];

export function listSeedHackathons(): HackathonSummary[] {
  return [
    ...publicHackathons.map((hackathon) => normalizeHackathonSummary(hackathon)),
    ...structuredClone(additionalHackathons),
  ];
}

export function findSeedHackathonSummary(slug: string) {
  return listSeedHackathons().find((hackathon) => hackathon.slug === slug);
}

export function listSeedHackathonDetails(): HackathonDetail[] {
  return structuredClone(allHackathonDetails);
}

export function findSeedHackathonDetail(slug: string) {
  return listSeedHackathonDetails().find((detail) => detail.slug === slug);
}
