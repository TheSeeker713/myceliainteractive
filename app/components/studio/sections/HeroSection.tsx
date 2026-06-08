"use client";

import Link from "next/link";
import { Button } from "@/app/components/studio/Button";

export function HeroContent() {
  return (
    <>
      <p className="text-sm font-medium tracking-wide text-studio-accent uppercase mb-4">
        New Mexico · Est. 2026
      </p>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-studio-text max-w-3xl">
        Mycelia Interactive LLC
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-studio-text-muted max-w-2xl leading-relaxed">
        Immersive interactive entertainment where the audience participates.
        Characters hear you. Stories respond in real time.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
        <Link href="/ls#access">
          <Button>Request Private Access to Liminal Sin Vertical Slice</Button>
        </Link>
        <a href="mailto:contact@myceliainteractive.com?subject=AI%20%26%20Cloud%20Credits%20Collaboration">
          <Button variant="secondary">
            Inquire About AI &amp; Cloud Credits Collaboration
          </Button>
        </a>
      </div>
    </>
  );
}
