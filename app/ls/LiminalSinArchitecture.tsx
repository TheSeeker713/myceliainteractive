"use client";

import { SectionReveal } from "@/app/components/motion/SectionReveal";
import { StudioCard } from "@/app/components/motion/StudioCard";

const ARCHITECTURE_BULLETS = [
  "Browser client (Next.js on Cloudflare) captures microphone audio and webcam frames at 1 FPS",
  "Bidirectional WebSocket connects to Cloud Run backend running Gemini Live multi-agent sessions",
  "Trust, fear, and scene state persist in Firestore across the session lifecycle",
  "Imagen 4 generates scene stills; Veo 3.1 Fast delivers generative video loops on scene change",
  "Frontend is a render terminal — all game logic and agent decisions live in the backend",
  "Marketing shell uses Cloudflare Workers AI for atmospheric FPV imagery only",
] as const;

export function LiminalSinArchitecture() {
  return (
    <SectionReveal className="ls-section-py bg-white/40">
      <div className="ls-gutter studio-section">
        <h2 className="text-2xl font-semibold text-studio-text mb-3">
          Architecture Overview
        </h2>
        <p className="text-studio-text-muted max-w-2xl mb-10 leading-relaxed">
          A minimal view of how the vertical slice connects browser input to
          live agent responses and generative media.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <StudioCard className="p-6 sm:p-8">
            <svg
              viewBox="0 0 400 220"
              className="w-full h-auto motion-line-glow"
              aria-label="Liminal Sin architecture diagram"
              role="img"
            >
              <rect
                x="20"
                y="70"
                width="100"
                height="60"
                rx="8"
                fill="rgba(255,255,255,0.9)"
                stroke="rgba(45,106,126,0.3)"
                strokeWidth="1"
              />
              <text x="70" y="105" textAnchor="middle" fontSize="11" fill="#171717">
                Browser
              </text>
              <text x="70" y="118" textAnchor="middle" fontSize="9" fill="#5c5c5c">
                Next.js / CF
              </text>

              <path
                d="M 125 100 L 175 100"
                stroke="rgba(45,106,126,0.4)"
                strokeWidth="1"
                markerEnd="url(#arrow)"
              />
              <text x="150" y="92" textAnchor="middle" fontSize="8" fill="#5c5c5c">
                WebSocket
              </text>

              <rect
                x="180"
                y="55"
                width="110"
                height="90"
                rx="8"
                fill="rgba(255,255,255,0.9)"
                stroke="rgba(45,106,126,0.3)"
                strokeWidth="1"
              />
              <text x="235" y="95" textAnchor="middle" fontSize="11" fill="#171717">
                Cloud Run
              </text>
              <text x="235" y="108" textAnchor="middle" fontSize="9" fill="#5c5c5c">
                Gemini Live
              </text>
              <text x="235" y="121" textAnchor="middle" fontSize="9" fill="#5c5c5c">
                Multi-agent
              </text>

              <path
                d="M 295 85 L 345 55"
                stroke="rgba(45,106,126,0.25)"
                strokeWidth="0.8"
              />
              <path
                d="M 295 115 L 345 145"
                stroke="rgba(45,106,126,0.25)"
                strokeWidth="0.8"
              />

              <rect
                x="350"
                y="30"
                width="40"
                height="40"
                rx="6"
                fill="rgba(232,244,248,0.8)"
                stroke="rgba(45,106,126,0.2)"
                strokeWidth="0.8"
              />
              <text x="370" y="55" textAnchor="middle" fontSize="8" fill="#5c5c5c">
                Imagen 4
              </text>

              <rect
                x="350"
                y="130"
                width="40"
                height="40"
                rx="6"
                fill="rgba(232,244,248,0.8)"
                stroke="rgba(45,106,126,0.2)"
                strokeWidth="0.8"
              />
              <text x="370" y="155" textAnchor="middle" fontSize="8" fill="#5c5c5c">
                Veo 3.1
              </text>

              <defs>
                <marker
                  id="arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L6,3 L0,6"
                    fill="rgba(45,106,126,0.4)"
                  />
                </marker>
              </defs>
            </svg>
          </StudioCard>

          <ul className="space-y-4">
            {ARCHITECTURE_BULLETS.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 text-sm text-studio-text-muted leading-relaxed"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionReveal>
  );
}
