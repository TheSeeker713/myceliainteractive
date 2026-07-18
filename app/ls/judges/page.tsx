"use client";

import { useEffect } from "react";

/**
 * Static-export fallback for /ls/judges → /ls.
 * Production also 301s this path in workers/signup-api.ts.
 */
export default function LsJudgesReroutePage() {
  useEffect(() => {
    window.location.replace("/ls");
  }, []);

  return (
    <main className="site-gutter py-16 min-h-[50vh]">
      <p className="text-studio-text-muted">
        Redirecting to{" "}
        <a href="/ls" className="text-studio-accent hover:underline">
          Liminal Sin
        </a>
        …
      </p>
    </main>
  );
}
