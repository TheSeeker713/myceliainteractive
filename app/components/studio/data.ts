export const PROJECTS = [
  {
    name: "Liminal Sin",
    featured: true,
    description:
      "A psychological interactive experience built around a real-time AI trust and response system. No fixed narrative paths. Characters react to what you actually do. Vertical slice prototype submitted to the Gemini Live Agent Challenge 2026.",
    href: "/ls",
    external: false,
  },
  {
    name: "The S33k3r Transmission",
    description:
      "A fully functional ARG and FMV interactive music video experience: a live demonstration of interactive entertainment on a public platform.",
    href: "https://www.thes33k3r.com",
    external: true,
  },
  {
    name: "KAIA",
    description:
      "Keep At It, Always: a gamified AI productivity SaaS for neurodivergent users. Persistent adaptive avatar companion, habit loops, and executive-function scaffolding. Pre-production; designed as a subscription-ready platform built on the same real-time agent architecture as Liminal Sin.",
    href: null,
    external: false,
  },
  {
    name: "Altered Imagination Studios",
    description:
      "A daily AI video content brand operating under the Mycelia Interactive umbrella: production output and live pipeline development for AI video generation.",
    href: null,
    external: false,
  },
] as const;

export const TEAM = [
  {
    name: "Adrianna Loya",
    role: "Co-founder · CEO, CCO, CFO",
    detail:
      "Leads Altered Imagination Studios, daily AI video production pipeline, and company operations and finance.",
    email: "adrianna@myceliainteractive.com",
  },
  {
    name: "Jeremy Robards",
    role: "Founder · CTO, CAIO, CCO",
    detail:
      "Leads product development, interactive systems architecture, Gemini Live integration, and full-stack delivery.",
    email: "jeremy@myceliainteractive.com",
  },
] as const;

export const ROADMAP_MILESTONES = [
  {
    title: "Liminal Sin vertical slice",
    timeframe: "Now",
    detail:
      "Gemini Live Agent Challenge submission; public gated demo with trust-driven narrative.",
  },
  {
    title: "Agent scaling + session reliability",
    timeframe: "0–6 months",
    detail:
      "Multi-session Cloud Run scaling, Firestore session hardening, production observability.",
  },
  {
    title: "Generative media pipeline",
    timeframe: "6–12 months",
    detail:
      "Imagen 4 + Veo 3.1 batch pre-generation, lower scene latency, richer environmental storytelling.",
  },
  {
    title: "KAIA private alpha",
    timeframe: "12–18 months",
    detail:
      "SaaS companion MVP for neurodivergent productivity: subscription-ready platform launch.",
  },
] as const;
