"use client";

import { FoldCard } from "@/app/components/motion/FoldCard";
import SignupForms from "@/app/ls/SignupForms";

const featureCards = [
  {
    label: "Your Voice Is the Mechanic",
    desc: "No controllers. No menus. You speak, and the characters react in real time.",
  },
  {
    label: "The House Watches You Back",
    desc: "The Game Master perceives your webcam and reads your vocal cadence.",
  },
  {
    label: "Full Motion Video: Generatively Rebuilt",
    desc: "Synthetic liminal spaces generated with Veo and Kling. Architecture that shifts mid-scene.",
  },
  {
    label: "Jason and the Player",
    desc: "The prototype centers on two actors: Jason and the Player, in a live voice-driven exchange.",
  },
  {
    label: "Trust System (MVP)",
    desc: "An enhanced trust system is planned for the MVP, where agent behavior can shift with honesty and manipulation. It is not implemented in this vertical-slice prototype.",
  },
] as const;

export function LiminalSinCapabilitiesContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-studio-text mb-8 max-md:mb-4">
        System capabilities
      </h2>
      {/* ≤767: single-column compact list; defer rich FoldCards */}
      <ul className="md:hidden space-y-3 list-none p-0 m-0">
        {featureCards.map((card) => (
          <li
            key={card.label}
            className="border-b border-[color:var(--theme-inset-border)] pb-3 last:border-0"
          >
            <h3 className="text-sm font-semibold text-studio-text">{card.label}</h3>
            <p className="mt-1 text-sm text-studio-text-muted leading-relaxed">
              {card.desc}
            </p>
          </li>
        ))}
      </ul>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featureCards.map((card, index) => (
          <FoldCard
            key={card.label}
            index={index}
            total={featureCards.length}
            className="p-5"
          >
            <h3 className="text-sm font-semibold text-studio-text">{card.label}</h3>
            <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
              {card.desc}
            </p>
          </FoldCard>
        ))}
      </div>
    </>
  );
}

export function LiminalSinAccessContent() {
  return (
    <>
      <div className="text-center mb-10 max-md:mb-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-studio-text">Request access</h2>
        <p className="mt-3 text-studio-text-muted max-md:text-sm">
          The prototype is closed to the public. Approved requesters receive a
          private play link within 24 hours.
        </p>
      </div>
      <SignupForms />
    </>
  );
}
