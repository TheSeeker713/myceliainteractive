"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/studio/Button";

export function LiminalSinHeroContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
      <div>
        <p className="text-sm font-medium text-studio-accent uppercase tracking-wide mb-3">
          Flagship prototype
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-studio-text">
          Liminal Sin
        </h1>
        <p className="mt-5 text-lg text-studio-text-muted leading-relaxed">
          A psychological interactive experience built around a real-time AI
          trust and response system. Your voice, behavior, and decisions shape
          how characters respond; there are no fixed narrative paths.
        </p>
        <p className="mt-4 text-sm text-studio-text-muted">
          Vertical slice prototype · Gemini Live Agent Challenge 2026
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#access">
            <Button>Request access</Button>
          </Link>
          <Link href="#experience">
            <Button variant="secondary">What you&apos;ll experience</Button>
          </Link>
          <Link href="/ls/game">
            <Button variant="secondary">About prototype access</Button>
          </Link>
        </div>
      </div>
      <div className="relative aspect-video rounded-xl overflow-hidden border border-black/8 shadow-sm">
        <Image
          src="/assets/images/Liminal_Sin_Title.jpg"
          alt="Liminal Sin"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
