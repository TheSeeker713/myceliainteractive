"use client";

import Image from "next/image";
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
    label: "Agents, Not Actors",
    desc: "Jason, Audrey, and Josh are autonomous AI agents with individual trust and fear metrics.",
  },
  {
    label: "Slotsky: The Probability Engine",
    desc: "The casino logic made sentient underground. It rearranges corridors. The house always wins.",
  },
  {
    label: "The Fourth Wall Is a Lie",
    desc: "Tell the characters they're in a simulation. Watch reality destabilize. Consequences are permanent.",
  },
] as const;

const trustCards = [
  {
    title: "Neutral",
    text: "The characters are cautious but willing to listen. Every interaction is a calculation.",
  },
  {
    title: "High Trust",
    text: "Environmental clues surface. Survival hints are shared. The characters follow your lead.",
  },
  {
    title: "Low Trust",
    text: "They may disobey, hide information, or spiral into paranoia.",
  },
] as const;

export function LiminalSinStoryContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-md:gap-0 items-center">
      <div className="space-y-5 max-md:space-y-4 text-studio-text-muted leading-relaxed">
        <p>
          <strong className="text-studio-text">Liminal Sin</strong> is Mycelia
          Interactive LLC&apos;s primary technology demonstration: a
          psychological interactive experience set in the Vegas Underground. You
          become a disembodied voice woven into a living story. Three people are
          trapped. They can hear you. Whether they trust you is entirely up to
          them.
        </p>
        <p>
          This is real-time AI-driven narrative, where voice, emotion, and
          trust reshape the story as it unfolds. A system that watches, listens,
          and responds.
        </p>
      </div>
      {/* ≤767: omit story image — two short paras only */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-black/8 max-md:hidden">
        <Image
          src="/assets/images/Liminal_Sin_Title.jpg"
          alt="Liminal Sin"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

export function LiminalSinTrustContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-studio-text mb-3">
        The Trust System
      </h2>
      <p className="text-studio-text-muted max-w-2xl mb-10 max-md:mb-5 leading-relaxed">
        The characters are agents, not actors. Their behavior shifts with every
        word you speak. Build trust through honesty. Destroy it through
        manipulation.
      </p>
      {/* ≤767: compact list — no FoldCard chrome */}
      <ul className="md:hidden space-y-3 list-none p-0 m-0">
        {trustCards.map((item) => (
          <li key={item.title} className="border-b border-black/8 pb-3 last:border-0">
            <h3 className="font-semibold text-studio-text text-sm">{item.title}</h3>
            <p className="mt-1 text-sm text-studio-text-muted leading-relaxed">
              {item.text}
            </p>
          </li>
        ))}
      </ul>
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-5">
        {trustCards.map((item, index) => (
          <FoldCard key={item.title} index={index} total={trustCards.length} className="p-6">
            <h3 className="font-semibold text-studio-text">{item.title}</h3>
            <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
              {item.text}
            </p>
          </FoldCard>
        ))}
      </div>
    </>
  );
}

export function LiminalSinCapabilitiesContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-studio-text mb-8 max-md:mb-4">
        System capabilities
      </h2>
      {/* ≤767: single-column compact list; defer rich FoldCards */}
      <ul className="md:hidden space-y-3 list-none p-0 m-0">
        {featureCards.map((card) => (
          <li key={card.label} className="border-b border-black/8 pb-3 last:border-0">
            <h3 className="text-sm font-semibold text-studio-text">{card.label}</h3>
            <p className="mt-1 text-sm text-studio-text-muted leading-relaxed">
              {card.desc}
            </p>
          </li>
        ))}
      </ul>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featureCards.map((card, index) => (
          <FoldCard key={card.label} index={index} total={featureCards.length} className="p-5">
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
