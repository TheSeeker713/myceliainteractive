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
  text?: string; // optional — backend may omit when audio-only
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

export type SceneImageEvent = {
  type: "scene_image";
  agent: string;
  sessionId: string;
  payload: { sceneKey: string; data: string }; // data is base64 JPEG
  timestamp: number;
};

export type SceneChangeEvent = {
  type: "scene_change";
  payload: { sceneKey: string };
};

export type SceneVideoEvent = {
  type: "scene_video";
  payload: { sceneKey: string; url: string };
};

export type SlotskyTriggerEvent = {
  type: "slotsky_trigger";
  payload: { anomalyType: string };
};

export type CameraObscuredEvent = {
  type: "camera_obscured";
  obscured: boolean;
};

export type HintEvent = {
  type: "hint";
  text: string;
};

export type ServerEvent =
  | AgentSpeechEvent
  | AgentInterruptEvent
  | TrustUpdateEvent
  | FmvTriggerEvent
  | FmvStopEvent
  | HudGlitchEvent
  | SessionReadyEvent
  | SessionErrorEvent
  | SceneImageEvent
  | SceneChangeEvent
  | SceneVideoEvent
  | SlotskyTriggerEvent
  | CameraObscuredEvent
  | HintEvent;

// ── Outbound payload types (client → server) ─────────────────────────────────────────────────────────────────────

export type ClientEvent =
  | { type: "session_start"; judge_mode: boolean }
  | { type: "player_speech"; audio: string; timestamp: number }
  | { type: "player_frame"; jpeg: string; timestamp: number }
  | { type: "session_end" }
  | { type: "card_collected"; sessionId: string }
  | { type: "intro_complete" };

// ── Context shape ──────────────────────────────────────────────────────────

export type ConnectionStatus = "connecting" | "open" | "closed" | "error";

interface GameWSContextValue {
  status: ConnectionStatus;
  lastEvent: ServerEvent | null;
  sceneImage: string | null; // base64 JPEG from latest SCENE_IMAGE event; persists across events
  sceneVideo: { sceneKey: string; url: string } | null;
  playerHasSpoken: boolean;
  send: (event: ClientEvent) => void;
  connect: () => void; // call from a user gesture to open the WS + start the session
  clearSceneVideo: () => void;
}

const GameWSContext = createContext<GameWSContextValue>({
  status: "closed",
  lastEvent: null,
  sceneImage: null,
  sceneVideo: null,
  playerHasSpoken: false,
  send: () => {},
  connect: () => {},
  clearSceneVideo: () => {},
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

  const [status, setStatus] = useState<ConnectionStatus>("closed");
  const [shouldConnect, setShouldConnect] = useState(false);
  const [lastEvent, setLastEvent] = useState<ServerEvent | null>(null);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [sceneVideo, setSceneVideo] = useState<{
    sceneKey: string;
    url: string;
  } | null>(null);
  const [playerHasSpoken, setPlayerHasSpoken] = useState(false);
  const playerHasSpokenRef = useRef(false);
  const wsRef = useRef<WebSocket | null>(null);

  const send = useCallback((event: ClientEvent) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
      if (event.type === "player_speech" && !playerHasSpokenRef.current) {
        playerHasSpokenRef.current = true;
        setPlayerHasSpoken(true);
      }
    }
  }, []);

  const clearSceneVideo = useCallback(() => setSceneVideo(null), []);

  // Called from a user gesture (Begin Session click). Flips shouldConnect so
  // the WS connects within the autoplay-policy grace window.
  const connect = useCallback(() => {
    setStatus("connecting");
    setShouldConnect(true);
  }, []);

  useEffect(() => {
    if (!wsUrl || !shouldConnect) return;

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
        if (parsed.type === "scene_image") {
          setSceneImage(parsed.payload.data);
        }
        if (parsed.type === "scene_video") {
          setSceneVideo((parsed as SceneVideoEvent).payload);
        }
      } catch {
        console.error("[GameWS] Failed to parse message:", ev.data);
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("closed");

    return () => {
      ws.close();
    };
  }, [wsUrl, judgeMode, send, shouldConnect]);

  return (
    <GameWSContext.Provider
      value={{
        status,
        lastEvent,
        sceneImage,
        sceneVideo,
        playerHasSpoken,
        send,
        connect,
        clearSceneVideo,
      }}
    >
      {children}
    </GameWSContext.Provider>
  );
}

// ── Consumer hook ──────────────────────────────────────────────────────────

export function useGameWS() {
  return useContext(GameWSContext);
}
