"use client";

import { useRef, useCallback } from "react";
import {
  AUDIO_MANIFEST,
  SESSION_LOCKED_KEYS,
  PRIORITY_KEYS,
  type MusicTier,
} from "./audioManifest";

/**
 * useAudioLayers — 3-channel Web Audio layer stack.
 *
 * Channels:
 *   musicGain   (0.3)  — background music, looped, crossfaded by trust/fear state
 *   sfxGain     (0.6)  — fire-and-forget sound effects
 *   ambientGain (0.12) — long ambient loops at low volume
 *
 * Randomisation — guarantees no two sessions ever sound identical:
 *   1. Session pre-pick: music + ambient variants chosen once at preloadAll()
 *      via Math.random(). Two players will hear different tracks for the same tier.
 *   2. SFX anti-repeat: each key tracks lastPlayedIndex. The next play picks any
 *      variant EXCEPT the last one, preventing consecutive duplicates.
 *   3. Volume micro-jitter: every SFX plays at baseVol × (0.92–1.08), so even
 *      a single-variant key sounds subtly different each time.
 *
 * The hook shares the AudioContext that GameHUD creates inside the Begin Session
 * gesture, so it inherits Chrome's autoplay-policy permission.
 */
export function useAudioLayers(
  audioCtxRef: React.MutableRefObject<AudioContext | null>,
) {
  // ── Internal state (all in refs — no re-renders) ───────────────────────
  const bufferCacheRef = useRef<Map<string, AudioBuffer[]>>(new Map());
  // Anti-repeat: remembers last-played index per SFX key
  const lastSfxIndexRef = useRef<Map<string, number>>(new Map());
  // Per-session pre-picked variant index for music + ambient keys
  const sessionLockedPicksRef = useRef<Map<string, number>>(new Map());

  const musicGainRef = useRef<GainNode | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const preloadedRef = useRef(false);

  // ── Utility ────────────────────────────────────────────────────────────

  const linearRamp = useCallback(
    (gainNode: GainNode, target: number, durationMs: number) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(target, now + durationMs / 1000);
    },
    // All deps are refs — stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Gain node initialisation ───────────────────────────────────────────
  // Call once immediately after creating the AudioContext in GameHUD.

  const ensureGainNodes = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || musicGainRef.current) return;

    musicGainRef.current = ctx.createGain();
    musicGainRef.current.gain.value = 0;
    musicGainRef.current.connect(ctx.destination);

    sfxGainRef.current = ctx.createGain();
    sfxGainRef.current.gain.value = 0.6;
    sfxGainRef.current.connect(ctx.destination);

    ambientGainRef.current = ctx.createGain();
    ambientGainRef.current.gain.value = 0;
    ambientGainRef.current.connect(ctx.destination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Preload all audio buffers ──────────────────────────────────────────

  const preloadAll = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx || preloadedRef.current) return;
    preloadedRef.current = true;

    // Roll session-locked picks for music + ambient keys
    for (const key of SESSION_LOCKED_KEYS) {
      const pool = AUDIO_MANIFEST[key];
      if (pool?.length) {
        sessionLockedPicksRef.current.set(
          key,
          Math.floor(Math.random() * pool.length),
        );
      }
    }

    const loadKey = async (key: string): Promise<void> => {
      const paths = AUDIO_MANIFEST[key];
      if (!paths?.length) return;
      const buffers: AudioBuffer[] = [];
      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (!res.ok) continue;
          const arr = await res.arrayBuffer();
          const buf = await ctx.decodeAudioData(arr);
          buffers.push(buf);
        } catch {
          // Missing or malformed file — skip silently, do not crash
        }
      }
      if (buffers.length) bufferCacheRef.current.set(key, buffers);
    };

    // Ambient files loaded first so they are ready before session_ready fires
    await Promise.allSettled(PRIORITY_KEYS.map(loadKey));

    const remaining = Object.keys(AUDIO_MANIFEST).filter(
      (k) => !PRIORITY_KEYS.includes(k),
    );
    await Promise.allSettled(remaining.map(loadKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Random variant selection ───────────────────────────────────────────

  const pickRandom = useCallback((key: string): AudioBuffer | null => {
    const buffers = bufferCacheRef.current.get(key);
    if (!buffers?.length) return null;
    if (buffers.length === 1) return buffers[0];

    const last = lastSfxIndexRef.current.get(key) ?? -1;
    let idx: number;
    // Guarantee a different index from last play
    do {
      idx = Math.floor(Math.random() * buffers.length);
    } while (idx === last);
    lastSfxIndexRef.current.set(key, idx);
    return buffers[idx];
  }, []);

  // ── SFX: fire-and-forget ──────────────────────────────────────────────

  const playSFX = useCallback(
    (key: string, volumeScale = 1.0) => {
      const ctx = audioCtxRef.current;
      const sfxGain = sfxGainRef.current;
      if (!ctx || !sfxGain) return;

      const buffer = pickRandom(key);
      if (!buffer) return;

      // ±8% volume jitter — same file sounds different on each play
      const jitter = 0.92 + Math.random() * 0.16;
      const perPlayGain = ctx.createGain();
      perPlayGain.gain.value = volumeScale * jitter;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(perPlayGain);
      perPlayGain.connect(sfxGain);
      source.start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Music: start a looping tier ───────────────────────────────────────

  const playMusic = useCallback(
    (tier: MusicTier, fadeInMs = 2000) => {
      const ctx = audioCtxRef.current;
      const mGain = musicGainRef.current;
      if (!ctx || !mGain) return;

      const buffers = bufferCacheRef.current.get(tier);
      if (!buffers?.length) return;

      // Use the session-pre-picked variant index
      const sessionIdx = sessionLockedPicksRef.current.get(tier) ?? 0;
      const buffer = buffers[Math.min(sessionIdx, buffers.length - 1)];

      if (musicSourceRef.current) {
        try {
          musicSourceRef.current.stop();
        } catch {
          /* already ended */
        }
        musicSourceRef.current = null;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(mGain);
      source.start();
      musicSourceRef.current = source;

      linearRamp(mGain, 0.3, fadeInMs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Music: crossfade to a new tier ───────────────────────────────────

  const crossfadeMusic = useCallback(
    (newTier: MusicTier, fadeDurationMs = 2000) => {
      const mGain = musicGainRef.current;
      if (!mGain) return;
      const half = fadeDurationMs / 2;
      linearRamp(mGain, 0, half);
      setTimeout(() => playMusic(newTier, half), half);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Music: fade out and stop ──────────────────────────────────────────

  const stopMusic = useCallback(
    (fadeOutMs = 2000) => {
      const mGain = musicGainRef.current;
      if (!mGain) return;
      linearRamp(mGain, 0, fadeOutMs);
      setTimeout(() => {
        if (musicSourceRef.current) {
          try {
            musicSourceRef.current.stop();
          } catch {
            /* already ended */
          }
          musicSourceRef.current = null;
        }
      }, fadeOutMs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Ambient: start a looping background layer ─────────────────────────

  const startAmbientLoop = useCallback(
    (key: string) => {
      const ctx = audioCtxRef.current;
      const aGain = ambientGainRef.current;
      if (!ctx || !aGain) return;

      const buffers = bufferCacheRef.current.get(key);
      if (!buffers?.length) {
        console.warn(`[AudioLayers] startAmbientLoop: '${key}' not loaded yet`);
        return;
      }

      if (ambientSourceRef.current) {
        try {
          ambientSourceRef.current.stop();
        } catch {
          /* already ended */
        }
      }

      // Use session-locked pick for ambient (same as music tier pre-pick)
      if (!sessionLockedPicksRef.current.has(key)) {
        sessionLockedPicksRef.current.set(
          key,
          Math.floor(Math.random() * buffers.length),
        );
      }
      const idx = sessionLockedPicksRef.current.get(key)!;
      const buffer = buffers[Math.min(idx, buffers.length - 1)];

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(aGain);
      source.start();
      ambientSourceRef.current = source;

      linearRamp(aGain, 0.16, 3000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const stopAmbientLoop = useCallback(
    (fadeMs = 2000) => {
      const aGain = ambientGainRef.current;
      if (!aGain) return;
      linearRamp(aGain, 0, fadeMs);
      setTimeout(() => {
        if (ambientSourceRef.current) {
          try {
            ambientSourceRef.current.stop();
          } catch {
            /* already ended */
          }
          ambientSourceRef.current = null;
        }
      }, fadeMs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Sequenced multi-step playback ─────────────────────────────────────
  // Used for fourth_wall_correction: bells at t=0, crackle at t=1500ms.

  const playSequence = useCallback(
    (steps: Array<{ key: string; delayMs: number }>) => {
      for (const step of steps) {
        setTimeout(() => playSFX(step.key), step.delayMs);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    ensureGainNodes,
    preloadAll,
    playSFX,
    playMusic,
    crossfadeMusic,
    stopMusic,
    startAmbientLoop,
    stopAmbientLoop,
    playSequence,
  };
}
