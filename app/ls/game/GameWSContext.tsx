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
import { MORPHIC_MEDIA_IDS } from "./mediaManifest";

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

// [AI: removed FmvTriggerEvent + FmvStopEvent — dead code, backend never sends these]

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
  payload: {
    sceneKey: string;
    mediaId: string;
    triggerType: "chained_auto" | "hold_for_input";
    timeoutSeconds: number;
  };
};

export type SceneVideoEvent = {
  type: "scene_video";
  payload: {
    sceneKey: string;
    mediaId: string;
    triggerType: "chained_auto" | "hold_for_input";
    timeoutSeconds: number;
    audioMode: "native_audio" | "muted" | "silent_source";
    url: string;
  };
};

export type SlotskyTriggerEvent = {
  type: "slotsky_trigger";
  payload: { anomalyType: string };
};

// [AI: removed CameraObscuredEvent — backend never sends this; detection is client-side only]

export type HintEvent = {
  type: "hint";
  text: string;
};

export type PlayerSpeakPromptEvent = {
  type: "player_speak_prompt";
};

export type CardDiscoveredEvent = {
  type: "card_discovered";
  cardId: "card1" | "card2";
};

export type OverlayTextEvent = {
  type: "overlay_text";
  payload: {
    text: string;
    variant: string;
    durationMs: number;
  };
};

export type NpcIdleNudgeEvent = {
  type: "npc_idle_nudge";
  payload: {
    phase: string;
    secondsSilent: number;
    urgency: "soft" | "urgent";
  };
};

export type AutoplayAdvanceEvent = {
  type: "autoplay_advance";
  payload: {
    fromStep: number;
    toStep: number;
    reason: "timeout" | "npc_choice";
  };
};

export type DreadTimerStartEvent = {
  type: "dread_timer_start";
  durationMs: number;
};

export type GameOverEvent = {
  type: "game_over";
};

export type GoodEndingEvent = {
  type: "good_ending";
};

export type AcecardKeywordTimerStartEvent = {
  type: "acecard_keyword_timer_start";
  payload: { durationMs: number };
};

export type AcecardRevealStartEvent = {
  type: "acecard_reveal_start";
  payload: { mediaId: string };
};

export type CardPickup02ReadyEvent = {
  type: "card_pickup_02_ready";
  payload: { mediaId: string; durationMs: number };
};

export type Wildcard3TriggerEvent = {
  type: "wildcard3_trigger";
  payload: { sceneKey: string };
};

export type VideoGenStartedEvent = {
  type: "video_gen_started";
  payload: {
    sceneKey: string;
    mediaId: string;
    triggerType: string;
    timeoutSeconds: number;
    audioMode: string;
  };
};

export type ServerEvent =
  | AgentSpeechEvent
  | AgentInterruptEvent
  | TrustUpdateEvent
  | HudGlitchEvent
  | SessionReadyEvent
  | SessionErrorEvent
  | SceneImageEvent
  | SceneChangeEvent
  | SceneVideoEvent
  | SlotskyTriggerEvent
  | HintEvent
  | PlayerSpeakPromptEvent
  | CardDiscoveredEvent
  | OverlayTextEvent
  | NpcIdleNudgeEvent
  | AutoplayAdvanceEvent
  | DreadTimerStartEvent
  | GameOverEvent
  | GoodEndingEvent
  | AcecardKeywordTimerStartEvent
  | AcecardRevealStartEvent
  | CardPickup02ReadyEvent
  | Wildcard3TriggerEvent
  | VideoGenStartedEvent;

// ── Outbound payload types (client → server) ─────────────────────────────────────────────────────────────────────

export type ClientEvent =
  | { type: "session_start"; judge_mode: boolean }
  | { type: "player_speech"; audio: string; timestamp: number }
  | { type: "player_frame"; jpeg: string; timestamp: number }
  | { type: "card_collected"; cardId: "card1" | "card2" }
  | { type: "intro_complete" }
  | { type: "hallway_pov_02_ready" }
  | { type: "acecard_reveal_complete" };

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

    const url = wsUrl; // narrow for closure
    let attempt = 0;
    const maxRetries = 3;
    const backoffMs = [1000, 3000, 5000];
    let currentWs: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function connectWs() {
      const ws = new WebSocket(url);
      currentWs = ws;
      wsRef.current = ws;

      ws.onopen = () => {
        attempt = 0; // reset on successful connect
        setStatus("open");
        send({ type: "session_start", judge_mode: judgeMode });
      };

      ws.onmessage = (ev) => {
        try {
          const parsed: ServerEvent = JSON.parse(ev.data as string);
          setLastEvent(parsed);
          if (parsed.type === "scene_image") {
            // Skip Morphic media — frontend loads clips/stills directly from GCS.
            // Setting sceneImage for Morphic IDs causes a React batching race
            // where the display effect hides the playing video clip.
            const mediaId = (parsed.payload as Record<string, unknown>)?.mediaId;
            if (!(typeof mediaId === "string" && MORPHIC_MEDIA_IDS.has(mediaId))) {
              setSceneImage(parsed.payload.data);
            }
          }
          if (parsed.type === "scene_video") {
            setSceneVideo((parsed as SceneVideoEvent).payload);
          }
        } catch {
          console.error("[GameWS] Failed to parse message:", ev.data);
        }
      };

      ws.onerror = () => {
        // onerror fires before onclose — let onclose handle reconnect
      };

      ws.onclose = () => {
        if (attempt < maxRetries) {
          setStatus("connecting");
          const delay = backoffMs[attempt] ?? 5000;
          attempt++;
          reconnectTimer = setTimeout(connectWs, delay);
        } else {
          setStatus("error");
        }
      };
    }

    connectWs();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      currentWs?.close();
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
