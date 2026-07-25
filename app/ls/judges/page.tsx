"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Legacy /ls/judges deep-link — static-export client page.
 * Client-side countdown + redirect only (no Worker 301, no SSR).
 * Safe for `output: "export"`: prerenders HTML, hydrates, then ticks.
 */
const COUNTDOWN_SECONDS = 11;
const DESTINATION = "/ls";

export default function LsJudgesInsultPage() {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      window.location.replace(DESTINATION);
      return;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [secondsLeft]);

  const redirectLabel =
    secondsLeft > 0
      ? `Redirecting in ${secondsLeft}…`
      : "Redirecting now…";

  return (
    <main className="site-gutter flex min-h-[100dvh] flex-col items-center justify-center py-16 text-center">
      <div className="mx-auto max-w-xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-studio-text-muted">
          /ls/judges
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-studio-text sm:text-4xl">
          Congratulations, you absolute fucking loser.
        </h1>

        <div className="space-y-4 text-base leading-relaxed text-studio-text-muted sm:text-lg">
          <p>
            This dead contest-judging link leads nowhere useful, and yet here
            you are — poking at a corpse like it owes you a ribbon.
          </p>
          <p>
            There is no panel. No clipboard. No little gold star for “I typed a
            URL.” Just you, this page, and the soft hum of wasted ambition.
          </p>
          <p className="text-studio-text">
            Sit with that for eleven seconds, champ. Then we&apos;ll politely
            frog-march your ass somewhere that actually exists.
          </p>
        </div>

        <p
          className="font-mono text-2xl font-semibold tabular-nums text-studio-accent"
          aria-live="polite"
          aria-atomic="true"
        >
          {redirectLabel}
        </p>

        <p className="text-sm text-studio-text-muted">
          Or just go here if you don&apos;t want to wait:{" "}
          <Link
            href={DESTINATION}
            className="font-medium text-studio-accent underline underline-offset-2 hover:opacity-90"
          >
            Liminal Sin landing
          </Link>
        </p>
      </div>
    </main>
  );
}
