"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GameClient } from "../game/GameClient";

type ValidateResult =
  | { valid: true }
  | { valid: false; reason?: string };

function PlayContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("access")?.trim() ?? "";
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">(() =>
    token ? "loading" : "invalid",
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function validate() {
      try {
        const res = await fetch(
          `/api/access/validate?access=${encodeURIComponent(token)}`,
        );
        const data = (await res.json()) as ValidateResult;
        if (!cancelled) setStatus(data.valid ? "valid" : "invalid");
      } catch {
        if (!cancelled) setStatus("invalid");
      }
    }

    validate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white/70 text-sm font-mono tracking-widest uppercase">
        Verifying access…
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="site-gutter min-h-screen flex items-center justify-center py-20">
        <div className="studio-section max-w-lg text-center">
          <h1 className="text-2xl font-semibold text-studio-text">
            Invalid or expired link
          </h1>
          <p className="mt-4 text-studio-text-muted leading-relaxed">
            This access link is invalid or has expired. Request access at{" "}
            <a
              href="mailto:contact@myceliainteractive.com"
              className="text-studio-accent hover:underline"
            >
              contact@myceliainteractive.com
            </a>{" "}
            or through the{" "}
            <Link href="/ls#access" className="text-studio-accent hover:underline">
              request form
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return <GameClient />;
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white/70 text-sm">
          Loading…
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
