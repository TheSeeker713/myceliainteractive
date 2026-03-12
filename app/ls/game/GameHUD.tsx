"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { useGameWS } from "./GameWSContext";
import { useAudioLayers } from "./useAudioLayers";
import { useGameError } from "./useGameError";
import { useAgentAudio } from "./useAgentAudio";
import { useSceneCallbacks } from "./useSceneCallbacks";
import { TrustMeter } from "./TrustMeter";
import { CardCollectibleOverlay } from "./CardCollectibleOverlay";
import { DemoEndOverlay } from "./DemoEndOverlay";
import { GMEyeIndicator } from "./GMEyeIndicator";
import { StatusNotices } from "./StatusNotices";
import { HintOverlays } from "./HintOverlays";
import { SceneVisualLayers } from "./SceneVisualLayers";
import { ErrorOverlay, ErrorModal } from "./ErrorOverlay";
import type {
  FmvTriggerEvent,
  HudGlitchEvent,
  TrustUpdateEvent,
  SessionReadyEvent,
  SessionErrorEvent,
  SlotskyTriggerEvent,
  HintEvent,
  SceneImageEvent,
} from "./GameWSContext";

/**
 * GameHUD — Stateless rendering layer.
 *
 * Reads lastEvent from GameWSContext and renders the appropriate overlay.
 * This component owns NO game logic — it only reacts to server-sent events.
 *
 * Per AGENTS.md §4 and TEAM_CONTRACT.md §2:
 * All trust/fear decisions live in liminal-sin-gemini. This file must never
 * encode agent behaviour.
 */

export default function GameHUD({
  sessionActive = false,
  audioCtxRef,
  webcamActive = false,
  micDenied = false,
  webcamDenied = false,
  cameraObscured = false,
  onStopMedia,
}: {
  sessionActive?: boolean;
  audioCtxRef: MutableRefObject<AudioContext | null>;
  webcamActive?: boolean;
  micDenied?: boolean;
  webcamDenied?: boolean;
  cameraObscured?: boolean;
  onStopMedia?: () => void;
}) {
  const { lastEvent, status, sceneImage, sceneVideo, clearSceneVideo, send } =
    useGameWS();
  const fmvRef = useRef<HTMLVideoElement>(null);

  // F1: text hint
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F5: glitch effect
  const [glitchClass, setGlitchClass] = useState<string | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F6: demo end sequence
  const [demoEnded, setDemoEnded] = useState(false);
  const [endOverlayVisible, setEndOverlayVisible] = useState(false);
  const wsCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F3: crossfade layers
  const [imgLayerA, setImgLayerA] = useState<string | null>(null);
  const [imgLayerB, setImgLayerB] = useState<string | null>(null);
  const [activeImgLayer, setActiveImgLayer] = useState<0 | 1>(0);
  const activeImgLayerRef = useRef<0 | 1>(0);
  const prevSceneImageRef = useRef<string | null>(null);

  // FE-8 / FE-11: scene container overlay states
  const [generatorLit, setGeneratorLit] = useState(false);
  const [generatorAmber, setGeneratorAmber] = useState(false);
  const [generatorFlickering, setGeneratorFlickering] = useState(false);
  const generatorFlickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // FE-9: VHS swap state
  const [vhsSwapping, setVhsSwapping] = useState(false);
  const vhsSwapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FE-10: card collectible state
  const [showCard, setShowCard] = useState(false);
  const [cardLabelVisible, setCardLabelVisible] = useState(false);
  const [cardCollecting, setCardCollecting] = useState(false);
  const cardLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hint event (backend B11) — fading text overlay
  const [serverHint, setServerHint] = useState<string | null>(null);
  const serverHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F4: scene video
  const sceneVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Audio layer system ───────────────────────────────────────────────────
  const {
    ensureGainNodes,
    preloadAll,
    playSFX,
    crossfadeMusic,
    stopMusic,
    startAmbientLoop,
    stopAmbientLoop,
    playSequence,
  } = useAudioLayers(audioCtxRef);

  const { errorQueue, dispatchError, dismissError } = useGameError();
  const [cameraObscuredVisible, setCameraObscuredVisible] = useState(false);
  const cameraObscuredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [webcamDeniedVisible, setWebcamDeniedVisible] = useState(false);
  const webcamDeniedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Trust/fear tracking — compare to previous values to detect crossings
  const prevTrustRef = useRef<number>(0.5);
  const prevFearRef = useRef<number>(0.0);
  const fearThresholdsCrossedRef = useRef<Set<number>>(new Set());
  // Fires once when trust first crosses 0.6 upward (resets if trust drops < 0.5)
  const trustKnowledgeFiredRef = useRef(false);

  useAgentAudio({
    audioCtxRef,
    lastEvent,
    playSFX,
    crossfadeMusic,
    dispatchError,
  });

  const { pushImage, handleSceneVideoEnded, handleVideoTimeUpdate } =
    useSceneCallbacks({
      activeImgLayerRef,
      setImgLayerA,
      setImgLayerB,
      setActiveImgLayer,
      sceneVideoRef,
      canvasRef,
      clearSceneVideo,
      vhsSwapping,
      setVhsSwapping,
      vhsSwapTimerRef,
    });

  // FE-8 / FE-11: Detect generator scene keys on scene_image events.
  useEffect(() => {
    if (lastEvent?.type !== "scene_image") return;
    const ev = lastEvent as SceneImageEvent;
    const key = ev.payload.sceneKey ?? "";
    const isGeneratorScene =
      key.includes("zone_merge") || key.includes("zone_park_shore");
    if (!isGeneratorScene) return;

    // FE-11: brightness flicker, then fade vignette + warm tint
    setGeneratorFlickering(true);
    if (generatorFlickerTimerRef.current)
      clearTimeout(generatorFlickerTimerRef.current);
    generatorFlickerTimerRef.current = setTimeout(() => {
      setGeneratorFlickering(false);
      setGeneratorLit(true);
      setTimeout(() => setGeneratorAmber(true), 100);
      generatorFlickerTimerRef.current = null;
    }, 1500);
  }, [lastEvent]);

  // hint event (backend B11) — show server-sent hint text for 6s then fade
  useEffect(() => {
    if (lastEvent?.type !== "hint") return;
    const ev = lastEvent as HintEvent;
    setServerHint(ev.text);
    if (serverHintTimerRef.current) clearTimeout(serverHintTimerRef.current);
    serverHintTimerRef.current = setTimeout(() => {
      setServerHint(null);
      serverHintTimerRef.current = null;
    }, 6000);
  }, [lastEvent]);

  // Create + resume AudioContext inside the Begin Session gesture tick.
  // Must NOT be created lazily in a WS message handler — Chrome's autoplay
  // policy suspends any AudioContext created outside a user gesture.
  useEffect(() => {
    if (!sessionActive || audioCtxRef.current) return;
    const ctx = new AudioContext({ sampleRate: 24000 });
    ctx.resume().catch(() => {});
    audioCtxRef.current = ctx;
    // Initialise gain nodes and kick off background preload of all audio assets.
    ensureGainNodes();
    preloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive]);

  // F5: HUD Glitch effect — applies full-screen CSS animation per intensity
  useEffect(() => {
    if (lastEvent?.type !== "hud_glitch") return;
    if (demoEnded) return; // no glitches after demo ends
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

    // Clear any in-flight glitch
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

  // FMV playback
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
  }, [lastEvent]);

  // session_ready: server has initialised both Gemini sessions — start ambient loop.
  useEffect(() => {
    if (lastEvent?.type !== "session_ready") return;
    void (lastEvent as SessionReadyEvent);
    startAmbientLoop("ambient_cold_open");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // FE-18: Show hint on player_speak_prompt; auto-hide after 8s
  useEffect(() => {
    if (lastEvent?.type !== "player_speak_prompt") return;
    setShowHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      setShowHint(false);
      hintTimerRef.current = null;
    }, 8000);
  }, [lastEvent]);

  // FE-19: Camera obscured — auto-dismiss after 5s
  useEffect(() => {
    if (!cameraObscured) return;
    setCameraObscuredVisible(true);
    if (cameraObscuredTimerRef.current)
      clearTimeout(cameraObscuredTimerRef.current);
    cameraObscuredTimerRef.current = setTimeout(() => {
      setCameraObscuredVisible(false);
      cameraObscuredTimerRef.current = null;
    }, 5000);
  }, [cameraObscured]);

  // FE-19: Webcam denied — auto-dismiss after 8s
  useEffect(() => {
    if (!webcamDenied) return;
    setWebcamDeniedVisible(true);
    if (webcamDeniedTimerRef.current)
      clearTimeout(webcamDeniedTimerRef.current);
    webcamDeniedTimerRef.current = setTimeout(() => {
      setWebcamDeniedVisible(false);
      webcamDeniedTimerRef.current = null;
    }, 8000);
  }, [webcamDenied]);

  // F3: crossfade scene images when sceneImage changes
  useEffect(() => {
    if (demoEnded) return; // F6: freeze scene after demo ends
    if (sceneImage === prevSceneImageRef.current) return;
    prevSceneImageRef.current = sceneImage;
    if (!sceneImage) return;
    pushImage(`data:image/jpeg;base64,${sceneImage}`);
    // Hide any leftover frozen video from F4
    if (sceneVideoRef.current) sceneVideoRef.current.style.display = "none";
  }, [sceneImage, pushImage, demoEnded]);

  // F4: play scene video when sceneVideo arrives
  useEffect(() => {
    if (demoEnded) return; // F6: no new videos after demo ends
    if (!sceneVideo) return;
    const video = sceneVideoRef.current;
    if (!video) return;
    video.src = sceneVideo.url;
    video.style.display = "block";
    video
      .play()
      .catch((e) => console.error("[GameHUD] scene_video play error:", e));
  }, [sceneVideo, demoEnded]);

  // trust_update: drive music crossfades and threshold SFX.
  useEffect(() => {
    if (lastEvent?.type !== "trust_update") return;
    const ev = lastEvent as TrustUpdateEvent;
    const { trust_level, fear_index } = ev;
    const prevTrust = prevTrustRef.current;
    const prevFear = prevFearRef.current;

    // Trust fell
    if (trust_level < prevTrust) {
      playSFX("trust_drop");
    }
    // Trust crossed 0.6 upward — private knowledge unlocked
    if (
      trust_level >= 0.6 &&
      prevTrust < 0.6 &&
      !trustKnowledgeFiredRef.current
    ) {
      trustKnowledgeFiredRef.current = true;
      playSFX("knowledge_unlock");
    }
    // Reset so it can fire again if trust recovers after dropping below 0.5
    if (trust_level < 0.5) trustKnowledgeFiredRef.current = false;

    // Sudden fear spike (delta > 0.10 in one update)
    if (fear_index - prevFear > 0.1) {
      playSFX("fear_spike");
    }
    // Fear threshold crossings — each fires once per session
    if (fear_index >= 0.6 && !fearThresholdsCrossedRef.current.has(0.6)) {
      fearThresholdsCrossedRef.current.add(0.6);
      crossfadeMusic("music_tension", 3000);
    }
    if (fear_index >= 0.85 && !fearThresholdsCrossedRef.current.has(0.85)) {
      fearThresholdsCrossedRef.current.add(0.85);
      crossfadeMusic("music_climax", 2000);
    }
    if (fear_index >= 0.9 && !fearThresholdsCrossedRef.current.has(0.9)) {
      fearThresholdsCrossedRef.current.add(0.9);
      playSFX("fear_critical");
    }

    prevTrustRef.current = trust_level;
    prevFearRef.current = fear_index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // slotsky_trigger: route each anomaly type to its audio event.
  useEffect(() => {
    if (lastEvent?.type !== "slotsky_trigger") return;
    const ev = lastEvent as SlotskyTriggerEvent;
    switch (ev.payload.anomalyType) {
      case "anomaly_bells":
        playSFX("slotsky_bells");
        break;
      case "anomaly_cards":
        // FE-10: play SFX + show card collectible overlay
        playSFX("slotsky_cards");
        setShowCard(true);
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
        // Bells first, sharp electrical crackle 1.5 s later, then psychosis music
        playSequence([
          { key: "fourth_wall_bells", delayMs: 0 },
          { key: "fourth_wall_crackle", delayMs: 1500 },
        ]);
        crossfadeMusic("music_psychosis", 1000);
        break;
      case "found_transition":
        // F6: Demo end sequence
        // 1. Stop all audio layers
        stopMusic(500);
        stopAmbientLoop(500);
        playSFX("proximity_found");
        // 2. Freeze scene — block all future image/video transitions
        setDemoEnded(true);
        // 3. After 2s: fade in end title overlay
        setTimeout(() => setEndOverlayVisible(true), 2000);
        // 4. After 7s: close WS gracefully
        wsCloseTimerRef.current = setTimeout(() => {
          send({ type: "session_end" });
        }, 7000);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // End session helper — graceful WS close then reload
  const handleEndSession = useCallback(() => {
    send({ type: "session_end" });
    setTimeout(() => window.location.reload(), 500);
  }, [send]);

  const handleCollectCard = useCallback(() => {
    if (cardCollecting) return;
    setCardCollecting(true);
    if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
    setTimeout(() => setShowCard(false), 500);
    const wsSessionId =
      (lastEvent as { sessionId?: string } | null)?.sessionId ?? "";
    send({ type: "card_collected", sessionId: wsSessionId });
  }, [cardCollecting, lastEvent, send]);

  // WS error state → fatal error card
  useEffect(() => {
    if (status !== "error") return;
    dispatchError({
      severity: "fatal",
      message: "The connection was lost. The backend may be unreachable.",
      context: "ws_error",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // session_error server event → fatal error card
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

  // Mic denied → fatal error card (mic is required)
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

  // Latest trust data for the HUD indicator
  const trustEvent =
    lastEvent?.type === "trust_update" ? (lastEvent as TrustUpdateEvent) : null;

  return (
    <div
      className={`absolute inset-0${glitchClass ? ` ${glitchClass}` : ""}`}
      style={
        glitchClass
          ? {
              animation:
                glitchClass === "hud-glitch-active-low"
                  ? "hud-glitch-low 0.5s ease-in-out infinite"
                  : glitchClass === "hud-glitch-active-medium"
                    ? "hud-glitch-medium 0.7s ease-in-out infinite"
                    : "hud-glitch-high 0.9s ease-in-out infinite",
            }
          : undefined
      }
    >
      <SceneVisualLayers
        glitchClass={glitchClass}
        generatorLit={generatorLit}
        generatorAmber={generatorAmber}
        generatorFlickering={generatorFlickering}
        imgLayerA={imgLayerA}
        imgLayerB={imgLayerB}
        activeImgLayer={activeImgLayer}
        sceneVideoRef={sceneVideoRef}
        canvasRef={canvasRef}
        vhsSwapping={vhsSwapping}
        handleSceneVideoEnded={handleSceneVideoEnded}
        handleVideoTimeUpdate={handleVideoTimeUpdate}
        fmvRef={fmvRef}
      />

      <HintOverlays showHint={showHint} serverHint={serverHint} />

      {/* ── GM Eye indicator (F2 redesign) ─────────────── */}
      <GMEyeIndicator
        visible={
          sessionActive && status === "open" && webcamActive && !demoEnded
        }
      />

      {/* ── Trust indicator (bottom-right) ─────────────────── */}
      <TrustMeter trustEvent={trustEvent} />

      {/* ── FE-10: Card collectible overlay ────────────────── */}
      <CardCollectibleOverlay
        showCard={showCard}
        demoEnded={demoEnded}
        cardCollecting={cardCollecting}
        cardLabelVisible={cardLabelVisible}
        onCollect={handleCollectCard}
      />

      {/* ── F6: Demo end overlay ────────────────────────── */}
      <DemoEndOverlay
        endOverlayVisible={endOverlayVisible}
        onStopMedia={onStopMedia}
      />

      <StatusNotices
        status={status}
        cameraObscuredVisible={cameraObscuredVisible}
        webcamDenied={webcamDenied}
        sessionActive={sessionActive}
        webcamDeniedVisible={webcamDeniedVisible}
      />

      {/* ── Error toast stack + fatal modals ────────────────── */}
      <ErrorOverlay
        errorQueue={errorQueue}
        onDismiss={dismissError}
        onEndSession={handleEndSession}
      />

      {/* ── Mic blocked modal (overrides ErrorOverlay for mic denial) ── */}
      {micDenied && !demoEnded && (
        <ErrorModal
          title="No Signal"
          message="Microphone access was denied. This experience requires your voice to proceed. We apologise — the session cannot continue without it."
          onEndSession={handleEndSession}
        />
      )}
    </div>
  );
}
