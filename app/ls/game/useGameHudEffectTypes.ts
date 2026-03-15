"use client";

import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { MusicTier } from "./audioManifest";
import type {
  CardDiscoveredEvent,
  ClientEvent,
  ConnectionStatus,
  SceneChangeEvent,
  ServerEvent,
} from "./GameWSContext";
import type { GameError } from "./useGameError";

export type HudEventRefs = {
  dreadIntervalRefs: MutableRefObject<ReturnType<typeof setInterval>[]>;
  dreadTimeoutRefs: MutableRefObject<ReturnType<typeof setTimeout>[]>;
  clearDreadTimers: () => void;
};

export type UseGameHudEffectsArgs = {
  lastEvent: ServerEvent | null;
  sceneChangeEvent: SceneChangeEvent | null;
  status: ConnectionStatus;
  sceneImage: string | null;
  sceneVideo: { sceneKey: string; url: string } | null;
  sessionActive: boolean;
  demoEnded: boolean;
  cameraObscured: boolean;
  webcamDenied: boolean;
  micDenied: boolean;
  audioCtxRef: MutableRefObject<AudioContext | null>;
  fmvRef: MutableRefObject<HTMLVideoElement | null>;
  sceneVideoRef: MutableRefObject<HTMLVideoElement | null>;
  ensureGainNodes: () => void;
  preloadAll: () => void;
  playSFX: (key: string, volumeScale?: number) => void;
  crossfadeMusic: (key: MusicTier, durationMs?: number) => void;
  stopMusic: (fadeDurationMs?: number) => void;
  startAmbientLoop: (key: string) => void;
  stopAmbientLoop: (fadeDurationMs?: number) => void;
  playSequence: (events: Array<{ key: string; delayMs: number }>) => void;
  dispatchError: (err: Omit<GameError, "id">) => void;
  send: (event: ClientEvent) => void;
  pushImage: (dataUri: string) => void;
  setGeneratorFlickering: Dispatch<SetStateAction<boolean>>;
  setGeneratorLit: Dispatch<SetStateAction<boolean>>;
  setGeneratorAmber: Dispatch<SetStateAction<boolean>>;
  generatorFlickerTimerRef: MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  setServerHint: Dispatch<SetStateAction<string | null>>;
  serverHintTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setGlitchClass: Dispatch<SetStateAction<string | null>>;
  glitchTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setShowHint: Dispatch<SetStateAction<boolean>>;
  hintTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setCameraObscuredVisible: Dispatch<SetStateAction<boolean>>;
  cameraObscuredTimerRef: MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  setWebcamDeniedVisible: Dispatch<SetStateAction<boolean>>;
  webcamDeniedTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  prevSceneImageRef: MutableRefObject<string | null>;
  setShowCard: Dispatch<SetStateAction<boolean>>;
  setCurrentCardId: Dispatch<SetStateAction<CardDiscoveredEvent["cardId"]>>;
  setCardLabelVisible: Dispatch<SetStateAction<boolean>>;
  cardLabelTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setDemoEnded: Dispatch<SetStateAction<boolean>>;
  setEndMode: Dispatch<
    SetStateAction<"complete" | "game_over" | "good_ending">
  >;
  setEndOverlayVisible: Dispatch<SetStateAction<boolean>>;
  setShowPlayAgain: Dispatch<SetStateAction<boolean>>;
  setTrustMeterActive: Dispatch<SetStateAction<boolean>>;
  setTrustLevel: Dispatch<SetStateAction<number>>;
  setFearIndex: Dispatch<SetStateAction<number>>;
  setTrustAgentLabel: Dispatch<SetStateAction<string>>;
  onStopMedia?: () => void;
  wsCloseTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
};
