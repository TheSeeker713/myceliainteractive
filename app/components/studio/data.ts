export const PROJECTS = [
  {
    name: "Liminal Sin",
    featured: true,
    image: "/assets/images/Liminal_Sin_Title.jpg",
    description:
      "A psychological interactive experience built around a real-time AI trust and response system. No fixed narrative paths. Characters react to what you actually do. Vertical slice prototype submitted to the Gemini Live Agent Challenge 2026.",
    href: "/ls",
    external: false,
  },
  {
    name: "The S33k3r Transmission",
    image: "/assets/images/S33k3r_Card.webp",
    description:
      "A fully functional ARG and FMV interactive music video experience: a live demonstration of interactive entertainment on a public platform.",
    href: "https://www.thes33k3r.com",
    external: true,
  },
  {
    name: "KAIA",
    image: "/assets/images/KAIA_Card.webp",
    description:
      "Keep At It, Always: a gamified AI productivity SaaS for neurodivergent users. Persistent adaptive avatar companion, habit loops, and executive-function scaffolding. Pre-production; designed as a subscription-ready platform built on the same real-time agent architecture as Liminal Sin.",
    href: null,
    external: false,
  },
  {
    name: "Altered Imagination Studios",
    video: "/assets/video/ais_clip.webm",
    description:
      "A daily AI video content brand operating under the Mycelia Interactive umbrella: production output and live pipeline development for AI video generation.",
    href: null,
    external: false,
  },
] as const;

export const TEAM = [
  {
    name: "Adrianna Loya",
    role: "Founder · CEO, CCO, CFO",
    detail:
      "Leads Altered Imagination Studios, daily AI video production pipeline, and company operations and finance.",
    email: "adrianna@myceliainteractive.com",
  },
  {
    name: "Jeremy Robards",
    role: "Co-founder · CTO, CAIO, CCO",
    detail:
      "Leads product development, agentic AI workflows, AI engineering, and immersive, interactive entertainment experiences. Full-stack development.",
    email: "jeremy@myceliainteractive.com",
  },
] as const;

export const ROADMAP_MILESTONES = [
  {
    title: "Liminal Sin vertical slice",
    timeframe: "Completed · Jan 2026",
    detail:
      "Finished Act 1 vertical slice; Gemini Live Agent Challenge submission and gated public demo.",
  },
  {
    title: "Mycelia Interactive website remodeling",
    timeframe: "Active · Jun–Jul 2026",
    detail:
      "Current active work: company site redesign and liquid-glass atmosphere cutover.",
  },
  {
    title: "Studio 25 Films",
    timeframe: "Active · Jul 2026",
    detail: "Active production work with Studio 25 Films.",
  },
  {
    title: "Agentic project work",
    timeframe: "Active · In progress",
    detail:
      "Ongoing development across agentic systems and related projects.",
  },
  {
    title: "KAIA prototype",
    timeframe: "Scheduled · Sep 2026",
    detail:
      "KAIA scheduled for production as a prototype in September 2026.",
  },
] as const;
