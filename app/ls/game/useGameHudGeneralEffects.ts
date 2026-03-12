"use client";

import { useEffect } from "react";
import type {
  AutoplayAdvanceEvent,
  FmvTriggerEvent,
  HintEvent,
  HudGlitchEvent,
  NpcIdleNudgeEvent,
  OverlayTextEvent,
  SceneImageEvent,
  SceneVideoEvent,
  SessionErrorEvent,
  SessionReadyEvent,
} from "./GameWSContext";
import type { UseGameHudEffectsArgs } from "./useGameHudEffectTypes";

export function useGameHudGeneralEffects(args: UseGameHudEffectsArgs) {
  const {
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
    startAmbientLoop,
    dispatchError,
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
    setTrustMeterActive,
    setTrustLevel,
    setFearIndex,
    setTrustAgentLabel,
  } = args;

  useEffect(() => {
    if (lastEvent?.type !== "scene_image") return;
    const ev = lastEvent as SceneImageEvent;
    const key = ev.payload.sceneKey ?? "";
    const isGeneratorScene =
      key.includes("generator_area") || key.includes("zone_park_shore");
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
    if (lastEvent?.type !== "overlay_text") return;
    const ev = lastEvent as OverlayTextEvent;
    setServerHint(ev.payload.text);
    if (serverHintTimerRef.current) clearTimeout(serverHintTimerRef.current);
    serverHintTimerRef.current = setTimeout(() => {
      setServerHint(null);
      serverHintTimerRef.current = null;
    }, Math.max(800, ev.payload.durationMs || 1800));
  }, [lastEvent, serverHintTimerRef, setServerHint]);

  useEffect(() => {
    if (lastEvent?.type !== "npc_idle_nudge") return;
    const ev = lastEvent as NpcIdleNudgeEvent;
    const text =
      ev.payload.urgency === "urgent"
        ? "Talk to Jason now."
        : "Talk to Jason.";
    setServerHint(text);
    if (serverHintTimerRef.current) clearTimeout(serverHintTimerRef.current);
    serverHintTimerRef.current = setTimeout(() => {
      setServerHint(null);
      serverHintTimerRef.current = null;
    }, ev.payload.urgency === "urgent" ? 2400 : 1800);
  }, [lastEvent, serverHintTimerRef, setServerHint]);

  useEffect(() => {
    if (lastEvent?.type !== "autoplay_advance") return;
    const ev = lastEvent as AutoplayAdvanceEvent;
    setServerHint(
      `Autoplay ${ev.payload.fromStep} -> ${ev.payload.toStep} (${ev.payload.reason})`,
    );
    if (serverHintTimerRef.current) clearTimeout(serverHintTimerRef.current);
    serverHintTimerRef.current = setTimeout(() => {
      setServerHint(null);
      serverHintTimerRef.current = null;
    }, 2200);
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
        "Microphone access was denied. This experience requires your voice. We apologise - the session cannot continue.",
      context: "mic_denied",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micDenied]);
}
