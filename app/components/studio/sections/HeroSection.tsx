"use client";

import Link from "next/link";

import { Button } from "@/app/components/studio/Button";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function HeroContent() {
  return (
    <SceneCard className="text-center">
      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-[clamp(2.25rem,8vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[#0f0f14]/95 text-balance">
            Mycelia Interactive
          </h1>
          <p className="text-[clamp(1.25rem,4vw,2rem)] text-[#1e1e28]/65">
            LLC
          </p>
        </div>

        <p className="max-w-prose mx-auto text-[clamp(1rem,2.5vw,1.25rem)] text-[#14141e]/78 leading-relaxed text-balance">
          Immersive interactive entertainment where the audience participates.
          Characters hear you. Stories respond in real time.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
          <Link href="/ls#access" className="w-full sm:w-auto sm:min-w-[12rem]">
            <Button
              size="lg"
              className="w-full min-h-11 sm:min-h-12 bg-[#1e5a64]/85 backdrop-blur-md border border-white/20 hover:bg-[#1e5a64]/95 shadow-[0_4px_16px_rgba(30,90,100,0.3)]"
            >
              Request Private Access to Liminal Sin
            </Button>
          </Link>
          <a
            href="mailto:contact@myceliainteractive.com?subject=AI%20%26%20Cloud%20Credits%20Collaboration"
            className="w-full sm:w-auto sm:min-w-[12rem]"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full min-h-11 sm:min-h-12 bg-white/15 backdrop-blur-md border border-black/15 hover:bg-white/28"
            >
              Inquire About Collaboration
            </Button>
          </a>
        </div>
      </div>
    </SceneCard>
  );
}
