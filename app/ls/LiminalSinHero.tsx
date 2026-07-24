"use client";

import Image from "next/image";
import { Button } from "@/app/components/studio/Button";
import { MobileCardImage } from "@/app/mobile/MobileCardImage";

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
          Mycelia Interactive LLC&apos;s primary technology demonstration: a
          psychological interactive experience set in the Vegas Underground. You
          become a disembodied voice woven into a living story with Jason —
          voice-driven, real-time AI narrative with no fixed paths.
        </p>
        <p className="mt-4 liquid-glass-body text-studio-text-muted leading-relaxed">
          Your voice, behavior, and decisions shape how characters respond. An
          enhanced trust system is planned for the MVP; it is not part of this
          vertical-slice prototype.
        </p>
        <p className="mt-4 text-sm text-studio-text-muted">
          Vertical slice prototype · Gemini Live Agent Challenge 2026
        </p>
        <MobileCardImage
          src="/assets/images/Liminal_Sin_Title.jpg"
          alt="Liminal Sin"
          className="mt-5"
        />
        {/* ≤767: one primary CTA; secondary links as compact text row; demote /ls/game */}
        <div className="mt-8 space-y-4">
          <Button href="#access" className="w-full min-h-11 md:w-auto">
            Request access
          </Button>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm md:hidden">
            <a
              href="#experience"
              className="font-medium text-studio-accent hover:underline min-h-11 inline-flex items-center"
            >
              What you&apos;ll experience
            </a>
            <a
              href="/ls/game"
              className="text-studio-text-muted hover:underline min-h-11 inline-flex items-center"
            >
              About prototype access
            </a>
          </div>
          <div className="hidden md:flex flex-wrap gap-3">
            <Button href="#experience" variant="secondary">
              What you&apos;ll experience
            </Button>
            <Button href="/ls/game" variant="secondary">
              About prototype access
            </Button>
          </div>
        </div>
      </div>
      <div className="relative aspect-video rounded-xl overflow-hidden border border-[color:var(--theme-inset-border)] shadow-sm max-md:hidden">
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
