export const en = {
  metadata: {
    title: "Hackathon Platform | Build, Compete, Create",
    description:
      "A casual hackathon platform where you can discover events, build teams, follow rankings, and host your own challenges.",
  },
  languageSwitcher: {
    label: "Language selector",
    english: "Switch to English",
    korean: "Switch to Korean",
  },
  hero: {
    headline: "Build. Compete. Create.",
    subcopy: "The casual hackathon platform where ideas turn into reality. Discover events, build your dream team, and climb the rankings.",
    primaryCta: {
      label: "Explore Hackathons",
      href: "#discover"
    },
    secondaryCta: {
      label: "Find a Team",
      href: "#team"
    }
  },
  flow: [
    {
      step: "01",
      title: "Discover",
      description: "Find hackathons that match your skills and interests."
    },
    {
      step: "02",
      title: "Team Up",
      description: "Connect with like-minded creators and build your squad."
    },
    {
      step: "03",
      title: "Rank Up",
      description: "Submit your projects, earn points, and climb the global leaderboard."
    }
  ],
  features: [
    {
      id: "discover",
      title: "Discover Events",
      description: "Browse curated hackathons from around the world. Whether you're a beginner or a seasoned pro, there's a challenge for you.",
      color: "bg-blue-500"
    },
    {
      id: "team",
      title: "Build Teams",
      description: "Don't hack alone. Our matching system helps you find developers, designers, and visionaries to complement your skills.",
      color: "bg-purple-500"
    },
    {
      id: "rankings",
      title: "Global Rankings",
      description: "Earn achievements and climb the leaderboards. Showcase your skills to the world and build your portfolio.",
      color: "bg-pink-500"
    },
    {
      id: "host",
      title: "Host & Sponsor",
      description: "Run your own hackathons with our powerful organizer tools. Coming soon.",
      color: "bg-orange-500"
    }
  ],
  rankingsPreview: [
    { rank: 1, team: "Neon Knights", score: 2450, status: "Active" },
    { rank: 2, team: "Cyber Syndicate", score: 2310, status: "Active" },
    { rank: 3, team: "Quantum Coders", score: 2180, status: "Active" },
    { rank: 4, team: "Byte Brawlers", score: 1950, status: "Active" },
  ],
  footer: {
    headline: "Ready to start building?",
    cta: {
      label: "Join the Platform",
      href: "#discover"
    }
  },
  nav: {
    discover: "Discover",
    teams: "Teams",
    rankings: "Rankings",
    getStarted: "Get Started",
  },
  card: {
    live: "Live",
    lookingForTeam: "Looking for Team",
    globalAIHack: "Global AI Hack",
    globalAIHackDesc: "Join 500+ hackers building the future of AI tools.",
    frontendDev: "Frontend Dev",
    frontendDevDesc: "React, Tailwind, Motion.",
    leaderboard: "Leaderboard",
    teamAlpha: "Team Alpha",
  },
  misc: {
    welcome: "Welcome to the arena",
    featuresTitle: "Everything you need",
    featuresSubtitle: "A platform designed for speed, collaboration, and showcasing your best work.",
    learnMore: "Learn more →",
    rankingsBadge: "Live Rankings",
    rankingsTitle: "Top Teams This Season",
    tableRank: "Rank",
    tableTeam: "Team",
    tableScore: "Score",
    tableStatus: "Status",
    viewFull: "View Full Leaderboard",
    rights: "HackPlatform. All rights reserved.",
    host: "Host",
  },
};

export type Dictionary = typeof en;
