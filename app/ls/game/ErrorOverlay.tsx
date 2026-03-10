"use client";

import { useEffect } from "react";
import type { GameError } from "./useGameError";

function ErrorToast({
  error,
  onDismiss,
}: {
  error: GameError;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(error.id), 8000);
    return () => clearTimeout(timer);
  }, [error.id, onDismiss]);

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded font-mono text-xs"
      style={{
        background: "#0a0a0a",
        border: "1px solid #dc2626",
        boxShadow: "0 0 12px rgba(220,38,38,0.25)",
        animation: "demo-end-fade-in 0.3s ease-out forwards",
      }}
    >
      <span className="mt-0.5 text-red-500 select-none">⚠</span>
      <div className="flex-1">
        <p className="text-red-300/90">{error.message}</p>
        {error.context && (
          <p className="text-red-500/50 text-[10px] mt-0.5 tracking-wider uppercase">
            {error.context}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(error.id)}
        className="text-red-500/50 hover:text-red-400 transition-colors ml-1 select-none"
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
}

export function ErrorModal({
  title,
  message,
  onEndSession,
  onDismiss,
}: {
  title: string;
  message: string;
  onEndSession: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      <div
        className="max-w-md w-full mx-6 p-8 font-mono"
        style={{
          background: "#0a0a0a",
          border: "1px solid #dc2626",
          boxShadow: "0 0 40px rgba(220,38,38,0.3)",
        }}
      >
        <p className="text-[10px] tracking-[0.35em] uppercase text-red-500/60 mb-3">
          System Error
        </p>
        <h2
          className="text-2xl font-black tracking-widest uppercase text-white mb-4"
          style={{ textShadow: "0 0 20px rgba(220,38,38,0.5)" }}
        >
          {title}
        </h2>
        <p className="text-sm text-red-200/70 leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onEndSession}
            className="px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-colors"
            style={{
              borderColor: "#dc2626",
              color: "#dc2626",
              background: "rgba(220,38,38,0.1)",
            }}
          >
            End Session
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-colors"
              style={{
                borderColor: "rgba(220,38,38,0.4)",
                color: "rgba(220,38,38,0.7)",
                background: "transparent",
              }}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorOverlay({
  errorQueue,
  onDismiss,
  onEndSession,
}: {
  errorQueue: GameError[];
  onDismiss: (id: string) => void;
  onEndSession: () => void;
}) {
  const fatalError = errorQueue.find((e) => e.severity === "fatal");
  const recoverableErrors = errorQueue.filter(
    (e) => e.severity === "recoverable",
  );

  return (
    <>
      {/* Toast stack — top-center, recoverable errors */}
      {recoverableErrors.length > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[65] flex flex-col gap-2 w-80 pointer-events-none">
          {recoverableErrors.map((err) => (
            <ErrorToast key={err.id} error={err} onDismiss={onDismiss} />
          ))}
        </div>
      )}

      {/* Fatal modal — blocks everything */}
      {fatalError && (
        <ErrorModal
          title="Signal Lost"
          message={fatalError.message}
          onEndSession={onEndSession}
        />
      )}
    </>
  );
}
