"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { AUDIO_MANIFEST } from "./audioManifest";
import { useGameWS } from "./GameWSContext";

type IntroPhase = "blank" | "credits" | "title" | "fadeout";

/**
 * IntroSequence — Cinematic opening before the game session begins.
 *
 * Sequence (total ~11.5s):
 *  0.0s  — Black screen + audio starts (intro music 0.37 gain, wind/drip 0.65 gain)
 *  1.2s  — Production credits fade in
 *  6.5s  — Credits fade out, "LIMINAL SIN" title fades in
 * 10.0s  — Title fades to black, audio fades out
 * 11.5s  — onComplete fires (game session takes over)
 *
 * Audio runs on dedicated gain nodes attached directly to the shared AudioContext.
 * The main audio layer system (useAudioLayers) is untouched — it takes over
 * cleanly once GameHUD receives its first session_ready event.
 *
 * Per AGENTS.md §4: no game logic here. This is presentation only.
 */
export function IntroSequence({
  audioCtxRef,
  onComplete,
}: {
  audioCtxRef: MutableRefObject<AudioContext | null>;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<IntroPhase>("blank");
  const [visible, setVisible] = useState(true);
  const { send } = useGameWS();

  const musicSrcRef = useRef<AudioBufferSourceNode | null>(null);
  const windSrcRef = useRef<AudioBufferSourceNode | null>(null);
  const introGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // ── Sequence timing ────────────────────────────────────────────────────
    timers.push(setTimeout(() => setPhase("credits"), 1200));
    timers.push(setTimeout(() => setPhase("title"), 6500));
    timers.push(
      setTimeout(() => {
        setPhase("fadeout");
        setVisible(false);
      }, 10000),
    );
    timers.push(
      setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          send({ type: "intro_complete" });
          onComplete();
        }
      }, 11500),
    );

    // ── Audio ──────────────────────────────────────────────────────────────
    const ctx = audioCtxRef.current;
    if (ctx) {
      const iGain = ctx.createGain();
      iGain.gain.value = 0;
      iGain.connect(ctx.destination);
      introGainRef.current = iGain;

      const wGain = ctx.createGain();
      wGain.gain.value = 0;
      wGain.connect(ctx.destination);
      windGainRef.current = wGain;

      // Begin fading out audio at t=10s (matches container fade)
      timers.push(
        setTimeout(() => {
          const now = ctx.currentTime;
          for (const gn of [iGain, wGain]) {
            gn.gain.cancelScheduledValues(now);
            gn.gain.setValueAtTime(gn.gain.value, now);
            gn.gain.linearRampToValueAtTime(0, now + 1.2);
          }
        }, 10000),
      );

      async function startAudio(actx: AudioContext) {
        // Intro music — random variant, loops, ramps to 0.37
        const musicPool = AUDIO_MANIFEST["music_intro"];
        if (musicPool?.length) {
          const url = musicPool[Math.floor(Math.random() * musicPool.length)];
          try {
            const res = await fetch(url);
            if (res.ok) {
              const buf = await actx.decodeAudioData(await res.arrayBuffer());
              const src = actx.createBufferSource();
              src.buffer = buf;
              src.loop = true;
              src.connect(iGain);
              src.start();
              musicSrcRef.current = src;
              const now = actx.currentTime;
              iGain.gain.setValueAtTime(0, now);
              iGain.gain.linearRampToValueAtTime(0.37, now + 2.5);
            }
          } catch {
            /* silent — missing file does not crash intro */
          }
        }

        // Ambient underlay (cold open drip/wind) — loops at 0.65 gain
        const windPool = AUDIO_MANIFEST["ambient_cold_open"];
        if (windPool?.length) {
          const url = windPool[Math.floor(Math.random() * windPool.length)];
          try {
            const res = await fetch(url);
            if (res.ok) {
              const buf = await actx.decodeAudioData(await res.arrayBuffer());
              const src = actx.createBufferSource();
              src.buffer = buf;
              src.loop = true;
              src.connect(wGain);
              src.start();
              windSrcRef.current = src;
              const now = actx.currentTime;
              wGain.gain.setValueAtTime(0, now);
              wGain.gain.linearRampToValueAtTime(0.65, now + 1.5);
            }
          } catch {
            /* silent */
          }
        }
      }

      void startAudio(ctx);
    }

    return () => {
      timers.forEach(clearTimeout);
      try {
        musicSrcRef.current?.stop();
      } catch {
        /* already stopped */
      }
      try {
        windSrcRef.current?.stop();
      } catch {
        /* already stopped */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const creditsShown = phase === "credits";
  const titleShown = phase === "title";

  return (
    <div
      className="absolute inset-0 z-[80] bg-black flex items-center justify-center select-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease-out",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* ── Production credits ─────────────────────────────── */}
      <div
        className="text-center font-mono"
        style={{
          opacity: creditsShown ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        <p
          className="text-xs tracking-[0.35em] uppercase mb-8"
          style={{ color: "rgba(192,132,252,0.55)" }}
        >
          A MYCELIA INTERACTIVE EXPERIENCE
        </p>
        <div className="flex flex-col gap-2">
          {["Directed by J.W.", "Produced by A.L.", "Music by THE S33K3R"].map(
            (line) => (
              <p
                key={line}
                className="text-xs tracking-[0.25em]"
                style={{ color: "rgba(160,160,160,0.45)" }}
              >
                {line}
              </p>
            ),
          )}
        </div>
      </div>

      {/* ── LIMINAL SIN title ──────────────────────────────── */}
      <div
        className="absolute text-center"
        style={{
          opacity: titleShown ? 1 : 0,
          transition: "opacity 1.8s ease-in-out",
        }}
      >
        <h1
          className="text-6xl md:text-8xl font-black tracking-[0.25em] uppercase text-white"
          style={{
            textShadow:
              "0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(139,44,245,0.3)",
          }}
        >
          LIMINAL SIN
        </h1>
      </div>
    </div>
  );
}
