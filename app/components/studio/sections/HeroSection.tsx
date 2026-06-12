"use client";

import Link from "next/link";

import { Button } from "@/app/components/studio/Button";
import { Card } from "@/app/components/studio/Card";

export function HeroContent() {
  return (
    <div className="relative min-h-[100vh] flex items-center justify-center py-2 px-4 sm:px-5">
      {/* The mycelium + bokeh layers are provided globally via SiteMotionShell */}

      <Card
        variant="glass"
        padding="xl"
        className="w-[94%] max-w-[none] mx-auto text-center relative z-10 border-studio-accent/10 py-64 sm:py-128"
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-[5.75rem] sm:text-[7rem] lg:text-[8rem] font-semibold tracking-[-1.5px] text-[#0f0f14]/95">
              Mycelia Interactive
            </h1>
            <p className="mt-5 text-3xl sm:text-[2.75rem] text-[#1e1e28]/65">LLC</p>
          </div>

          <p className="max-w-[52rem] mx-auto text-2xl sm:text-[1.75rem] text-[#14141e]/78 leading-relaxed">
            Immersive interactive entertainment where the audience participates.
            Characters hear you. Stories respond in real time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/ls#access" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#1e5a64]/85 backdrop-blur-md border border-white/20 hover:bg-[#1e5a64]/95 shadow-[0_4px_16px_rgba(30,90,100,0.3)]"
              >
                Request Private Access to Liminal Sin
              </Button>
            </Link>
            <a
              href="mailto:contact@myceliainteractive.com?subject=AI%20%26%20Cloud%20Credits%20Collaboration"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-white/15 backdrop-blur-md border border-black/15 hover:bg-white/28"
              >
                Inquire About Collaboration
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
