"use client";

import {
  useEffect,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import type {
  CardDiscoveredEvent,
  ClientEvent,
  ConnectionStatus,
  DreadTimerStartEvent,
  FmvTriggerEvent,
  GameOverEvent,
  GoodEndingEvent,
  HintEvent,
  HudGlitchEvent,
  SceneImageEvent,
  SceneVideoEvent,
  ServerEvent,
  SessionErrorEvent,
  SessionReadyEvent,
  SlotskyTriggerEvent,
} from "./GameWSContext";
import type { GameError } from "./useGameError";

export function useGameHudEffects({
  lastEvent,
  status,
  sceneImage,
  sceneVideo,
  sessionActive,
  demoEnded,
  cameraObscured,
  webcamDenied,
  micDenied,
  audioCtxRef,
  fmvRef,
  sceneVideoRef,
  ensureGainNodes,
  preloadAll,
  playSFX,
  crossfadeMusic,
  stopMusic,
  startAmbientLoop,
  stopAmbientLoop,
  playSequence,
  dispatchError,
  send,
  pushImage,
  setGeneratorFlickering,
  setGeneratorLit,
  setGeneratorAmber,
  generatorFlickerTimerRef,
  setServerHint,
  serverHintTimerRef,
  setGlitchClass,
  glitchTimerRef,
  setShowHint,
  hintTimerRef,
  setCameraObscuredVisible,
  cameraObscuredTimerRef,
  setWebcamDeniedVisible,
  webcamDeniedTimerRef,
  prevSceneImageRef,
  setShowCard,
  setCurrentCardId,
  setCardLabelVisible,
  cardLabelTimerRef,
  setDemoEnded,
  setEndMode,
  setEndOverlayVisible,
  setShowPlayAgain,
  setTrustMeterActive,
  setTrustLevel,
  setFearIndex,
  setTrustAgentLabel,
  onStopMedia,
  wsCloseTimerRef,
}: {
  lastEvent: ServerEvent | null;
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
  crossfadeMusic: (key: string, durationMs?: number) => void;
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
  setCurrentCardId: Dispatch<SetStateAction<"card1" | "card2">>;
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
}) {
  const dreadIntervalRefs = useRef<ReturnType<typeof setInterval>[]>([]);
  const dreadTimeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearDreadTimers = () => {
    for (const id of dreadIntervalRefs.current) clearInterval(id);
    for (const id of dreadTimeoutRefs.current) clearTimeout(id);
    dreadIntervalRefs.current = [];
    dreadTimeoutRefs.current = [];
  };

  useEffect(() => {
    if (lastEvent?.type !== "scene_image") return;
    const ev = lastEvent as SceneImageEvent;
    const key = ev.payload.sceneKey ?? "";
    const isGeneratorScene =
      key.includes("zone_merge") || key.includes("zone_park_shore");
    if (!isGeneratorScene) return;

    setGeneratorFlickering(true);
    if (generatorFlickerTimerRef.current)
      clearTimeout(generatorFlickerTimerRef.current);
    generatorFlickerTimerRef.current = setTimeout(() => {
      setGeneratorFlickering(false);
      setGeneratorLit(true);
      setTimeout(() => setGeneratorAmber(true), 100);
      generatorFlickerTimerRef.current = null;
    }, 1500);
  }, [
    generatorFlickerTimerRef,
    lastEvent,
    setGeneratorAmber,
    setGeneratorFlickering,
    setGeneratorLit,
  ]);

  useEffect(() => {
    if (lastEvent?.type !== "hint") return;
    const ev = lastEvent as HintEvent;
    setServerHint(ev.text);
    if (serverHintTimerRef.current) clearTimeout(serverHintTimerRef.current);
    serverHintTimerRef.current = setTimeout(() => {
      setServerHint(null);
      serverHintTimerRef.current = null;
    }, 6000);
  }, [lastEvent, serverHintTimerRef, setServerHint]);

  useEffect(() => {
    if (!sessionActive || audioCtxRef.current) return;
    const ctx = new AudioContext({ sampleRate: 24000 });
    ctx.resume().catch(() => {});
    audioCtxRef.current = ctx;
    ensureGainNodes();
    preloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive]);

  useEffect(() => {
    if (lastEvent?.type !== "hud_glitch") return;
    if (demoEnded) return;
    const ev = lastEvent as HudGlitchEvent;

    const classMap: Record<string, string> = {
      low: "hud-glitch-active-low",
      medium: "hud-glitch-active-medium",
      high: "hud-glitch-active-high",
    };
    const cls = classMap[ev.intensity] ?? classMap.medium;
    const duration =
      ev.duration_ms ||
      (ev.intensity === "low" ? 500 : ev.intensity === "high" ? 1200 : 800);

    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    setGlitchClass(cls);

    glitchTimerRef.current = setTimeout(() => {
      setGlitchClass(null);
      glitchTimerRef.current = null;
    }, duration);

    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  useEffect(() => {
    if (!fmvRef.current) return;
    if (lastEvent?.type === "fmv_trigger") {
      const ev = lastEvent as FmvTriggerEvent;
      fmvRef.current.src = `/assets/fmv/${ev.sequence_id}.mp4`;
      fmvRef.current.loop = ev.loop;
      fmvRef.current.style.display = "block";
      fmvRef.current.play().catch(() => {});
    }
    if (lastEvent?.type === "fmv_stop") {
      fmvRef.current.pause();
      fmvRef.current.style.display = "none";
    }
  }, [fmvRef, lastEvent]);

  useEffect(() => {
    if (lastEvent?.type !== "session_ready") return;
    void (lastEvent as SessionReadyEvent);
    startAmbientLoop("ambient_cold_open");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  useEffect(() => {
    if (lastEvent?.type !== "player_speak_prompt") return;
    setTrustMeterActive(true);
    setShowHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      setShowHint(false);
      hintTimerRef.current = null;
    }, 8000);
  }, [hintTimerRef, lastEvent, setShowHint, setTrustMeterActive]);

  useEffect(() => {
    if (lastEvent?.type !== "trust_update") return;
    setTrustLevel(Math.max(0, Math.min(1, lastEvent.trust_level)));
    setFearIndex(Math.max(0, Math.min(1, lastEvent.fear_index)));
    if (lastEvent.agent) setTrustAgentLabel(lastEvent.agent);
  }, [lastEvent, setFearIndex, setTrustAgentLabel, setTrustLevel]);

  useEffect(() => {
    if (!lastEvent) return;
    if (
      lastEvent.type === "scene_change" ||
      lastEvent.type === "scene_image" ||
      lastEvent.type === "scene_video"
    ) {
      playSFX("glitch_low", 0.7);
    }
  }, [lastEvent, playSFX]);

  useEffect(() => {
    if (!cameraObscured) return;
    setCameraObscuredVisible(true);
    if (cameraObscuredTimerRef.current)
      clearTimeout(cameraObscuredTimerRef.current);
    cameraObscuredTimerRef.current = setTimeout(() => {
      setCameraObscuredVisible(false);
      cameraObscuredTimerRef.current = null;
    }, 5000);
  }, [cameraObscured, cameraObscuredTimerRef, setCameraObscuredVisible]);

  useEffect(() => {
    if (!webcamDenied) return;
    setWebcamDeniedVisible(true);
    if (webcamDeniedTimerRef.current)
      clearTimeout(webcamDeniedTimerRef.current);
    webcamDeniedTimerRef.current = setTimeout(() => {
      setWebcamDeniedVisible(false);
      webcamDeniedTimerRef.current = null;
    }, 8000);
  }, [setWebcamDeniedVisible, webcamDenied, webcamDeniedTimerRef]);

  useEffect(() => {
    if (demoEnded) return;
    if (sceneImage === prevSceneImageRef.current) return;
    prevSceneImageRef.current = sceneImage;
    if (!sceneImage) return;
    pushImage(`data:image/jpeg;base64,${sceneImage}`);
    if (sceneVideoRef.current) sceneVideoRef.current.style.display = "none";
  }, [demoEnded, prevSceneImageRef, pushImage, sceneImage, sceneVideoRef]);

  useEffect(() => {
    if (demoEnded) return;
    if (!sceneVideo) return;
    const video = sceneVideoRef.current;
    if (!video) return;
    const payload = sceneVideo as SceneVideoEvent["payload"];
    video.src = payload.url;
    video.style.display = "block";
    video
      .play()
      .catch((e) => console.error("[GameHUD] scene_video play error:", e));
  }, [demoEnded, sceneVideo, sceneVideoRef]);

  useEffect(() => {
    if (lastEvent?.type !== "slotsky_trigger") return;
    const ev = lastEvent as SlotskyTriggerEvent;
    switch (ev.payload.anomalyType) {
      case "anomaly_bells":
        playSFX("slotsky_bells");
        break;
      case "anomaly_cards":
        playSFX("slotsky_cards");
        setShowCard(true);
        setCurrentCardId("card2");
        setCardLabelVisible(false);
        if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
        cardLabelTimerRef.current = setTimeout(() => {
          setCardLabelVisible(true);
          cardLabelTimerRef.current = null;
        }, 2000);
        break;
      case "anomaly_lights":
        playSFX("slotsky_lights");
        break;
      case "anomaly_geometry":
        playSFX("slotsky_geometry");
        break;
      case "fourth_wall_correction":
        playSequence([
          { key: "fourth_wall_bells", delayMs: 0 },
          { key: "fourth_wall_crackle", delayMs: 1500 },
        ]);
        crossfadeMusic("music_psychosis", 1000);
        break;
      case "found_transition":
        clearDreadTimers();
        stopMusic(500);
        stopAmbientLoop(500);
        playSFX("proximity_found");
        setDemoEnded(true);
        setEndMode("complete");
        setShowPlayAgain(false);
        setTimeout(() => setEndOverlayVisible(true), 2000);
        wsCloseTimerRef.current = setTimeout(() => {
          send({ type: "session_end" });
        }, 7000);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  useEffect(() => {
    if (lastEvent?.type !== "card_discovered") return;
    const ev = lastEvent as CardDiscoveredEvent;
    playSFX("card_appear");
    setCurrentCardId(ev.cardId);
    setShowCard(true);
    setCardLabelVisible(false);
    if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
    cardLabelTimerRef.current = setTimeout(() => {
      setCardLabelVisible(true);
      cardLabelTimerRef.current = null;
    }, 2000);
  }, [
    cardLabelTimerRef,
    lastEvent,
    playSFX,
    setCardLabelVisible,
    setCurrentCardId,
    setShowCard,
  ]);

  useEffect(() => {
    if (lastEvent?.type !== "dread_timer_start") return;
    const ev = lastEvent as DreadTimerStartEvent;
    clearDreadTimers();

    const total = ev.durationMs > 0 ? ev.durationMs : 90000;
    const phase1 = setInterval(() => playSFX("heartbeat_low", 0.55), 1250);
    dreadIntervalRefs.current.push(phase1);

    const t30 = setTimeout(() => {
      clearInterval(phase1);
      const phase2 = setInterval(() => playSFX("heartbeat_mid", 0.7), 880);
      dreadIntervalRefs.current.push(phase2);
    }, 30000);
    dreadTimeoutRefs.current.push(t30);

    const t60 = setTimeout(() => {
      for (const id of dreadIntervalRefs.current) clearInterval(id);
      dreadIntervalRefs.current = [];
      const high = setInterval(() => {
        playSFX("heartbeat_high1", 0.85);
        playSFX("heartbeat_high2", 0.85);
      }, 760);
      const growl = setInterval(() => {
        playSFX("distant_growl1", 0.8);
        playSFX("distant_growl2", 0.8);
      }, 4800);
      dreadIntervalRefs.current.push(high, growl);
    }, 60000);
    dreadTimeoutRefs.current.push(t60);

    const tend = setTimeout(() => {
      clearDreadTimers();
    }, total);
    dreadTimeoutRefs.current.push(tend);
  }, [lastEvent, playSFX]);

  useEffect(() => {
    if (lastEvent?.type !== "game_over") return;
    void (lastEvent as GameOverEvent);
    clearDreadTimers();
    stopMusic(500);
    stopAmbientLoop(500);
    playSFX("monster_sound1", 1);
    playSFX("monster_sound2", 1);
    setDemoEnded(true);
    setEndMode("game_over");
    setShowPlayAgain(false);
    setTimeout(() => {
      setEndOverlayVisible(true);
      onStopMedia?.();
    }, 1200);
  }, [
    lastEvent,
    onStopMedia,
    playSFX,
    setDemoEnded,
    setEndMode,
    setEndOverlayVisible,
    setShowPlayAgain,
    stopAmbientLoop,
    stopMusic,
  ]);

  useEffect(() => {
    if (lastEvent?.type !== "good_ending") return;
    void (lastEvent as GoodEndingEvent);
    clearDreadTimers();
    stopMusic(500);
    stopAmbientLoop(500);
    setDemoEnded(true);
    setEndMode("good_ending");
    setEndOverlayVisible(true);
    setShowPlayAgain(false);
    const timer = setTimeout(() => setShowPlayAgain(true), 5000);
    dreadTimeoutRefs.current.push(timer);
    onStopMedia?.();
  }, [
    lastEvent,
    onStopMedia,
    setDemoEnded,
    setEndMode,
    setEndOverlayVisible,
    setShowPlayAgain,
    stopAmbientLoop,
    stopMusic,
  ]);

  useEffect(() => {
    if (status !== "error") return;
    dispatchError({
      severity: "fatal",
      message: "The connection was lost. The backend may be unreachable.",
      context: "ws_error",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (lastEvent?.type !== "session_error") return;
    const ev = lastEvent as SessionErrorEvent;
    dispatchError({
      severity: "fatal",
      message: ev.message || "A server-side session error occurred.",
      context: `session_error:${ev.code}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  useEffect(() => {
    if (!micDenied) return;
    dispatchError({
      severity: "fatal",
      message:
        "Microphone access was denied. This experience requires your voice. We apologise — the session cannot continue.",
      context: "mic_denied",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micDenied]);
}
