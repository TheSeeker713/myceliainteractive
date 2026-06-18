"use client";

import { useState, useCallback } from "react";
import { deriveGameHttpBase } from "./deriveGameHttpBase";

export type GameErrorSeverity = "recoverable" | "fatal";

export interface GameError {
  id: string;
  message: string;
  severity: GameErrorSeverity;
  context?: string;
  sessionId?: string;
}

const MAX_VISIBLE = 3;

export function useGameError() {
  const [errorQueue, setErrorQueue] = useState<GameError[]>([]);

  const dispatchError = useCallback((err: Omit<GameError, "id">) => {
    const id = crypto.randomUUID();
    const fullError: GameError = { id, ...err };

    setErrorQueue((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), fullError]);

    // Fire-and-forget to D1 via Cloudflare Worker
    void fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: err.sessionId ?? "unknown",
        errorType: err.context ?? "client_error",
        message: err.message,
        severity: err.severity,
        url: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    }).catch(() => {});

    // Pre-wire Firestore log via Cloud Run (silent 404 until B7 backend session)
    const httpBase = deriveGameHttpBase();
    if (httpBase) {
      void fetch(`${httpBase}/log-client-error`, {
        method: "POST",
        signal: AbortSignal.timeout(3000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: err.sessionId ?? "unknown",
          errorType: err.context ?? "client_error",
          message: err.message,
          severity: err.severity,
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
  }, []);

  const dismissError = useCallback((id: string) => {
    setErrorQueue((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { errorQueue, dispatchError, dismissError };
}
