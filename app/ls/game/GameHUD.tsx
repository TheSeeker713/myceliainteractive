"use client";

import { useEffect, useRef } from "react";
import { useGameWS } from "./GameWSContext";
import type {
  AgentSpeechEvent,
  FmvTriggerEvent,
  HudGlitchEvent,
  TrustUpdateEvent,
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

export default function GameHUD() {
  const { lastEvent, status, sceneImage } = useGameWS();
  const glitchRef = useRef<HTMLDivElement>(null);
  const fmvRef = useRef<HTMLVideoElement>(null);
  // Shared AudioContext — one per session, not one per chunk.
  // nextPlayTimeRef schedules chunks end-to-end for gapless playback.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // HUD Glitch effect
  useEffect(() => {
    if (lastEvent?.type !== "hud_glitch") return;
    const ev = lastEvent as HudGlitchEvent;
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

  // Agent audio playback — raw 16-bit little-endian PCM at 24kHz from Gemini Live.
  // decodeAudioData() only handles encoded formats (MP3/WAV) — must decode PCM manually.
  useEffect(() => {
    if (lastEvent?.type !== "agent_speech") return;
    const ev = lastEvent as AgentSpeechEvent;
    if (!ev.audio) return;

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

        // Schedule gapless: each chunk starts exactly where the previous ended
        const now = ctx.currentTime;
        const startAt = Math.max(nextPlayTimeRef.current, now);
        source.start(startAt);
        nextPlayTimeRef.current = startAt + audioBuf.duration;
      } catch (e) {
        console.error("[GameHUD] Audio playback error:", e);
      }
    })();
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
