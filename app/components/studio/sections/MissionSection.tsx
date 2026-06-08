"use client";

import Link from "next/link";

export function MissionContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Mission</h2>
      <p className="text-studio-text-muted max-w-3xl leading-relaxed">
        Our work is defined by one design principle: the audience participates.
        We build real-time AI systems where voice, vision, and behavior reshape
        narrative as it unfolds — starting with immersive interactive
        entertainment as our proving ground.{" "}
        <Link
          href="/vision"
          className="text-studio-accent hover:underline font-medium"
        >
          Explore our 10-year north star horizon →
        </Link>
      </p>
    </>
  );
}
