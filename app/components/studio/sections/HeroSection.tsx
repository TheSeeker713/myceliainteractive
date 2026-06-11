"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/studio/Button";
import { Card } from "@/app/components/studio/Card";

export function HeroContent() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center pt-12 pb-16">
      {/* The mycelium + bokeh layers are provided globally via SiteMotionShell */}

      <Card
        variant="glass"
        padding="lg"
        className="max-w-3xl mx-auto text-center relative z-10 border-studio-accent/10"
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium tracking-[3px] text-studio-accent uppercase mb-3">
              New Mexico · Est. 2026
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-1.5px] text-studio-text">
              Mycelia Interactive
            </h1>
            <p className="mt-2 text-xl text-studio-text-muted">LLC</p>
          </div>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-studio-text-muted leading-relaxed">
            Immersive interactive entertainment where the audience participates.
            Characters hear you. Stories respond in real time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/ls#access" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Request Private Access to Liminal Sin
              </Button>
            </Link>
            <a
              href="mailto:contact@myceliainteractive.com?subject=AI%20%26%20Cloud%20Credits%20Collaboration"
              className="w-full sm:w-auto"
            >
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Inquire About Collaboration
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
