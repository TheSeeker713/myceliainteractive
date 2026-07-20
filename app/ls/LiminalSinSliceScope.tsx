"use client";

import { FoldCard } from "@/app/components/motion/FoldCard";

const SCOPE_ITEMS = [
  { label: "Scope", value: "Act 1 vertical slice: Vegas Underground setting" },
  { label: "Agents", value: "Jason, Audrey, and Josh: autonomous trust/fear agents" },
  { label: "Mechanics", value: "Voice-driven interaction, Trust Meter, dread escalation" },
  { label: "Endings", value: "Game Over and Good Ending paths based on trust outcomes" },
  { label: "Submission", value: "Gemini Live Agent Challenge 2026: live interactive demo" },
  { label: "Access", value: "Gated prototype: approved requests receive play link within 24 hours" },
] as const;

/** ≤767: 3–4 scope lines (triage); desktop keeps full FoldCard grid. */
const MOBILE_SCOPE_ITEMS = SCOPE_ITEMS.slice(0, 4);

export function LiminalSinSliceScopeContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-studio-text mb-3">
        Vertical Slice Scope
      </h2>
      <p className="text-studio-text-muted max-w-2xl mb-8 max-md:mb-4 leading-relaxed">
        This build is a focused technology demonstration, not the full game. It
        proves real-time multi-agent narrative, trust systems, and generative
        media orchestration under live player input.
      </p>
      <ul className="md:hidden space-y-3 list-none p-0 m-0">
        {MOBILE_SCOPE_ITEMS.map((item) => (
          <li key={item.label} className="border-b border-black/8 pb-3 last:border-0">
            <p className="text-xs font-medium uppercase tracking-wide text-studio-accent">
              {item.label}
            </p>
            <p className="mt-1 text-sm text-studio-text-muted leading-relaxed">
              {item.value}
            </p>
          </li>
        ))}
      </ul>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCOPE_ITEMS.map((item, index) => (
          <FoldCard key={item.label} index={index} total={SCOPE_ITEMS.length} className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-studio-accent">
              {item.label}
            </p>
            <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
              {item.value}
            </p>
          </FoldCard>
        ))}
      </div>
    </>
  );
}
