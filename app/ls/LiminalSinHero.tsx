"use client";

import Image from "next/image";
import { Button } from "@/app/components/studio/Button";

export function LiminalSinHeroContent() {
  return (
    <div className="grid grid-cols-1 gap-6 items-center">
      <div>
        <p data-lg-kicker className="liquid-glass-kicker text-studio-accent mb-3">
          Flagship prototype
        </p>
        <h1 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal">
          Liminal Sin
        </h1>
        <p className="mt-5 liquid-glass-body text-studio-text-muted leading-relaxed">
          A psychological interactive experience built around a real-time AI
          trust and response system. Your voice, behavior, and decisions shape
          how characters respond; there are no fixed narrative paths.
        </p>
        <p className="mt-4 text-sm text-studio-text-muted">
          Vertical slice prototype · Gemini Live Agent Challenge 2026
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#access">Request access</Button>
          <Button href="#experience" variant="secondary">
            What you&apos;ll experience
          </Button>
          <Button href="/ls/game" variant="secondary">
            About prototype access
          </Button>
        </div>
      </div>
      <div className="relative aspect-video rounded-xl overflow-hidden border border-black/8 shadow-sm">
        <Image
          src="/assets/images/Liminal_Sin_Title.jpg"
          alt="Liminal Sin"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
        />
      </div>
    </div>
  );
}
