"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useGameWS } from "./GameWSContext";
import { useAudioLayers } from "./useAudioLayers";
import type {
  AgentSpeechEvent,
  FmvTriggerEvent,
  HudGlitchEvent,
  TrustUpdateEvent,
  SessionReadyEvent,
  SlotskyTriggerEvent,
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
}: {
  sessionActive?: boolean;
  audioCtxRef: MutableRefObject<AudioContext | null>;
}) {
  const { lastEvent, status, sceneImage } = useGameWS();
  const glitchRef = useRef<HTMLDivElement>(null);
  const fmvRef = useRef<HTMLVideoElement>(null);
  // nextPlayTimeRef schedules chunks end-to-end for gapless playback.
  const nextPlayTimeRef = useRef<number>(0);
  // All in-flight scheduled source nodes. Cleared on agent_interrupt so Jason
  // stops immediately when the player speaks over him.
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);

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

  // Trust/fear tracking — compare to previous values to detect crossings
  const prevTrustRef = useRef<number>(0.5);
  const prevFearRef = useRef<number>(0.0);
  const fearThresholdsCrossedRef = useRef<Set<number>>(new Set());
  // Fires once when trust first crosses 0.6 upward (resets if trust drops < 0.5)
  const trustKnowledgeFiredRef = useRef(false);
  // Fires voicebox_activate + music_intro on Jason's very first utterance
  const firstJasonSpeechRef = useRef(false);

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

  // Barge-in: player spoke over Jason — kill all queued audio immediately.
  useEffect(() => {
    if (lastEvent?.type !== "agent_interrupt") return;
    playSFX("barge_in");
    const nodes = sourceNodesRef.current;
    for (const node of nodes) {
      try { node.stop(); } catch { /* already stopped or never started */ }
    }
    sourceNodesRef.current = [];
    nextPlayTimeRef.current = 0;
    console.log(`[GameHUD] agent_interrupt — cancelled ${nodes.length} queued audio nodes`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // HUD Glitch effect
  useEffect(() => {
    if (lastEvent?.type !== "hud_glitch") return;
    const ev = lastEvent as HudGlitchEvent;
    playSFX(`glitch_${ev.intensity}`);
    const el = glitchRef.current;
    if (!el) return;

    const intensityMap: Record<string, string> = {
      low: "opacity-20",
      medium: "opacity-50",
      high: "opacity-80",
    };
    const opacityClass = intensityMap[ev.intensity] ?? "opacity-40";

    el.classList.add(opacityClass, "animate-pulse");
    const timer = setTimeout(() => {
      el.classList.remove(opacityClass, "animate-pulse");
    }, ev.duration_ms);
    return () => clearTimeout(timer);
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
    if (trust_level >= 0.6 && prevTrust < 0.6 && !trustKnowledgeFiredRef.current) {
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
        playSFX("slotsky_cards");
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
        // Stop all layers, 8-second darkness silence, then water rise
        stopMusic(500);
        stopAmbientLoop(500);
        playSFX("proximity_found");
        setTimeout(() => playSFX("found_water_rise"), 8000);
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // Agent audio playback — raw 16-bit little-endian PCM at 24kHz from Gemini Live.
  // decodeAudioData() only handles encoded formats (MP3/WAV) — must decode PCM manually.
  useEffect(() => {
    if (lastEvent?.type !== "agent_speech") return;
    const ev = lastEvent as AgentSpeechEvent;
    if (!ev.audio) return;

    // Detect start of a new utterance (audio queue was empty when this chunk arrived).
    // First-ever utterance: voicebox_activate + crossfade to intro music.
    // Subsequent utterances: transmission ping.
    if (sourceNodesRef.current.length === 0) {
      if (!firstJasonSpeechRef.current) {
        firstJasonSpeechRef.current = true;
        playSFX("voicebox_activate");
        crossfadeMusic("music_intro", 2000);
      } else {
        playSFX("transmission_ping");
      }
    }

    (async () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") await ctx.resume();

        // Decode base64 → raw bytes → Int16 → Float32
        const binary = atob(ev.audio);
        const numSamples = binary.length >> 1; // 2 bytes per 16-bit sample
        const float32 = new Float32Array(numSamples);
        for (let i = 0; i < numSamples; i++) {
          const lo = binary.charCodeAt(i * 2) & 0xff;
          const hi = binary.charCodeAt(i * 2 + 1) & 0xff;
          const s16 = (hi << 8) | lo;
          float32[i] = (s16 > 32767 ? s16 - 65536 : s16) / 32768;
        }

        const audioBuf = ctx.createBuffer(1, numSamples, 24000);
        audioBuf.copyToChannel(float32, 0);

        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        source.connect(ctx.destination);
        sourceNodesRef.current.push(source);
        source.onended = () => {
          sourceNodesRef.current = sourceNodesRef.current.filter(n => n !== source);
        };

        // Schedule gapless: each chunk starts exactly where the previous ended
        const now = ctx.currentTime;
        const startAt = Math.max(nextPlayTimeRef.current, now);
        source.start(startAt);
        nextPlayTimeRef.current = startAt + audioBuf.duration;
      } catch (e) {
        console.error("[GameHUD] Audio playback error:", e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // Latest trust data for the HUD indicator
  const trustEvent =
    lastEvent?.type === "trust_update"
      ? (lastEvent as TrustUpdateEvent)
      : null;

  return (
    <>
      {/* ── Imagen 4 scene background (beneath FMV at z-10) ── */}
      {sceneImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/jpeg;base64,${sceneImage}`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
        />
      )}

      {/* ── FMV layer (beneath HUD overlays) ─────────────── */}
      <video
        ref={fmvRef}
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{ display: "none" }}
        playsInline
        muted={false}
      />

      {/* [REMOVED March 8 2026: Cracked glass overlay deferred to roadmap. Feature removed from demo scope per user directive.
           Frontend will use a semi-transparent Smart Glasses overlay (future). glitchRef will be null — the
           hud_glitch useEffect is null-guarded (if (!el) return), so this is safe. Original preserved below via false && pattern. */}
      {false && (
        <div
          ref={glitchRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200"
          style={{
            backgroundImage:
              "url('/assets/images/cracked-glass.png')",
            backgroundSize: "cover",
            opacity: 0,
          }}
        />
      )}

      {/* ── Scanline overlay ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        }}
      />

      {/* ── Trust indicator (bottom-right) ─────────────────── */}
      {trustEvent && (
        <div className="absolute bottom-6 right-6 z-40 font-mono text-xs text-purple-300/80 flex flex-col items-end gap-1">
          <span className="tracking-widest uppercase text-[10px] text-purple-400/50">
            {trustEvent.agent}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-purple-200">TRUST</span>
            <div className="w-24 h-1 bg-purple-900/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all duration-700"
                style={{ width: `${trustEvent.trust_level * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-300">FEAR</span>
            <div className="w-24 h-1 bg-red-900/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-700"
                style={{ width: `${trustEvent.fear_index * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Connection status banner (dev visibility) ─────── */}
      {status !== "open" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-1 rounded bg-black/70 border border-red-500/40 text-red-400 text-xs font-mono tracking-widest uppercase">
          {status === "connecting" && "Establishing Connection…"}
          {status === "closed" && "Signal Lost"}
          {status === "error" && "Connection Error — No Backend"}
        </div>
      )}
    </>
  );
}
