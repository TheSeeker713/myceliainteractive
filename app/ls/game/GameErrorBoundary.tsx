"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { deriveGameHttpBase } from "./deriveGameHttpBase";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const payload = {
      sessionId: "boundary",
      errorType: "react_boundary",
      message: error.message,
      severity: "fatal",
      stack:
        `${error.stack ?? ""}\n\nComponent:\n${info.componentStack ?? ""}`.slice(
          0,
          2000,
        ),
      url: typeof window !== "undefined" ? window.location.pathname : "",
    };

    void fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    const httpBase = deriveGameHttpBase();
    if (httpBase) {
      void fetch(`${httpBase}/log-client-error`, {
        method: "POST",
        signal: AbortSignal.timeout(3000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, timestamp: Date.now() }),
      }).catch(() => {});
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="w-full h-screen flex flex-col items-center justify-center bg-black font-mono"
          style={{ color: "rgba(220,38,38,0.8)" }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-red-500/50 mb-4">
            Critical System Failure
          </p>
          <h1
            className="text-4xl font-black tracking-widest uppercase text-white mb-6"
            style={{ textShadow: "0 0 30px rgba(220,38,38,0.5)" }}
          >
            The Signal Was Lost.
          </h1>
          <p className="text-sm text-red-300/60 mb-8 max-w-sm text-center leading-relaxed">
            {this.state.errorMessage ||
              "An unexpected error interrupted the experience."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-xs font-mono tracking-widest uppercase"
            style={{
              border: "1px solid var(--color-game-danger)",
              color: "var(--color-game-danger)",
              background: "rgba(220,38,38,0.1)",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
