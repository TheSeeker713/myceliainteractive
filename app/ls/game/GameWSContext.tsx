"use client";

/**
 * GameWSContext — WebSocket client for the Liminal Sin game shell.
 *
 * Connects to NEXT_PUBLIC_GAME_WS_URL (Cloud Run or mock server).
 * Provides send() + the latest inbound server event to all consumers.
 *
 * Event contract is defined in TEAM_CONTRACT.md §3.
 * This file must NEVER contain game-logic decisions — it is a dumb transport only.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Inbound event types (server → client) ──────────────────────────────────

export type AgentSpeechEvent = {
  type: "agent_speech";
  agent: string;
  audio: string; // base64
  text: string;
};

export type AgentInterruptEvent = {
  type: "agent_interrupt";
  agent: string;
};

export type TrustUpdateEvent = {
  type: "trust_update";
  agent: string;
  trust_level: number;
  fear_index: number;
};

export type FmvTriggerEvent = {
  type: "fmv_trigger";
  sequence_id: string;
  loop: boolean;
};

export type FmvStopEvent = { type: "fmv_stop" };

export type HudGlitchEvent = {
  type: "hud_glitch";
  intensity: string;
  duration_ms: number;
};

export type SessionReadyEvent = {
  type: "session_ready";
  session_id: string;
};

export type SessionErrorEvent = {
  type: "session_error";
  code: string;
  message: string;
};

export type ServerEvent =
  | AgentSpeechEvent
  | AgentInterruptEvent
  | TrustUpdateEvent
  | FmvTriggerEvent
  | FmvStopEvent
  | HudGlitchEvent
  | SessionReadyEvent
  | SessionErrorEvent;

// ── Outbound payload types (client → server) ───────────────────────────────

export type ClientEvent =
  | { type: "session_start"; judge_mode: boolean }
  | { type: "player_speech"; audio: string; timestamp: number }
  | { type: "player_frame"; jpeg: string; timestamp: number }
  | { type: "session_end" };

// ── Context shape ──────────────────────────────────────────────────────────

export type ConnectionStatus = "connecting" | "open" | "closed" | "error";

interface GameWSContextValue {
  status: ConnectionStatus;
  lastEvent: ServerEvent | null;
  send: (event: ClientEvent) => void;
}

const GameWSContext = createContext<GameWSContextValue>({
  status: "closed",
  lastEvent: null,
  send: () => {},
});

// ── Provider ───────────────────────────────────────────────────────────────

export function GameWSProvider({
  children,
  judgeMode = false,
}: {
  children: React.ReactNode;
  judgeMode?: boolean;
}) {
  const wsUrl = process.env.NEXT_PUBLIC_GAME_WS_URL;

  const [status, setStatus] = useState<ConnectionStatus>(
    wsUrl ? "connecting" : "error"
  );
  const [lastEvent, setLastEvent] = useState<ServerEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const send = useCallback((event: ClientEvent) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    }
  }, []);

  useEffect(() => {
    if (!wsUrl) {
      console.warn("[GameWS] NEXT_PUBLIC_GAME_WS_URL is not set — connection skipped.");
      return;
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
      send({ type: "session_start", judge_mode: judgeMode });
    };

    ws.onmessage = (ev) => {
      try {
        const parsed: ServerEvent = JSON.parse(ev.data as string);
        setLastEvent(parsed);
      } catch {
        console.error("[GameWS] Failed to parse message:", ev.data);
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("closed");

    return () => {
      ws.close();
    };
  }, [wsUrl, judgeMode, send]);

  return (
    <GameWSContext.Provider value={{ status, lastEvent, send }}>
      {children}
    </GameWSContext.Provider>
  );
}

// ── Consumer hook ──────────────────────────────────────────────────────────

export function useGameWS() {
  return useContext(GameWSContext);
}
