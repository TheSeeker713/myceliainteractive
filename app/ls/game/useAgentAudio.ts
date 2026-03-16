"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { AgentSpeechEvent, ServerEvent } from "./GameWSContext";

type DispatchError = (error: {
  severity: "recoverable" | "fatal";
  message: string;
  context: string;
}) => void;

/**
 * useAgentAudio
 *
 * Extracted audio playback pipeline for agent_speech and agent_interrupt.
 * Keeps all scheduling refs private and exposes only what GameHUD needs.
 */
export function useAgentAudio({
  audioCtxRef,
  lastEvent,
  playSFX,
  crossfadeMusic,
  dispatchError,
}: {
  audioCtxRef: MutableRefObject<AudioContext | null>;
  lastEvent: ServerEvent | null;
  playSFX: (key: string, volumeScale?: number) => void;
  crossfadeMusic: (
    tier: "music_intro" | "music_tension" | "music_climax" | "music_psychosis",
    fadeMs?: number,
  ) => void;
  dispatchError: DispatchError;
}) {
  // nextPlayTimeRef schedules Jason chunks end-to-end for gapless playback.
  const nextPlayTimeRef = useRef<number>(0);
  // In-flight Jason source nodes are cancelled on agent_interrupt.
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);

  // FE-12: Audrey-specific audio nodes (not cancelled by agent_interrupt).
  const audreySourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const audreyNextPlayTimeRef = useRef<number>(0);

  // Fires voicebox_activate + music_intro on Jason's very first utterance.
  const firstJasonSpeechRef = useRef(false);

  // Barge-in: player spoke over Jason — kill all queued Jason audio immediately.
  // Radio static SFX removed — plays once at session start via backend clip_sfx only.
  useEffect(() => {
    if (lastEvent?.type !== "agent_interrupt") return;

    const nodes = sourceNodesRef.current;
    for (const node of nodes) {
      try {
        node.stop();
      } catch {
        /* already stopped or never started */
      }
    }

    sourceNodesRef.current = [];
    nextPlayTimeRef.current = 0;
    console.log(
      `[useAgentAudio] agent_interrupt - cancelled ${nodes.length} Jason audio nodes (Audrey preserved)`,
    );
  }, [lastEvent]);

  // Agent audio playback — raw 16-bit little-endian PCM at 24kHz.
  useEffect(() => {
    if (lastEvent?.type !== "agent_speech") return;

    const ev = lastEvent as AgentSpeechEvent;
    if (!ev.audio) return;

    // FE-12: Route Audrey through echo pipeline.
    if (ev.agent === "audrey") {
      (async () => {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
          }

          const ctx = audioCtxRef.current;
          if (ctx.state === "suspended") await ctx.resume();

          // Decode PCM.
          const binary = atob(ev.audio);
          const numSamples = binary.length >> 1;
          const float32 = new Float32Array(numSamples);
          for (let i = 0; i < numSamples; i++) {
            const lo = binary.charCodeAt(i * 2) & 0xff;
            const hi = binary.charCodeAt(i * 2 + 1) & 0xff;
            const s16 = (hi << 8) | lo;
            float32[i] = (s16 > 32767 ? s16 - 65536 : s16) / 32768;
          }

          const audioBuf = ctx.createBuffer(1, numSamples, 24000);
          audioBuf.copyToChannel(float32, 0);

          // Reverb impulse + short delay for Audrey's voice.
          const impulseLen = Math.floor(ctx.sampleRate * 1.5);
          const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate);
          for (let ch = 0; ch < 2; ch++) {
            const d = impulse.getChannelData(ch);
            for (let i = 0; i < impulseLen; i++) {
              d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2);
            }
          }

          const convolver = ctx.createConvolver();
          convolver.buffer = impulse;

          const delay = ctx.createDelay(0.5);
          delay.delayTime.value = 0.15;

          const source = ctx.createBufferSource();
          source.buffer = audioBuf;

          const outputGain = ctx.createGain();
          outputGain.gain.value = 0.7;

          const dryGain = ctx.createGain();
          dryGain.gain.value = 0.4;

          const wetGain = ctx.createGain();
          wetGain.gain.value = 0.6;

          source.connect(outputGain);
          outputGain.connect(dryGain);
          dryGain.connect(ctx.destination);
          outputGain.connect(delay);
          delay.connect(convolver);
          convolver.connect(wetGain);
          wetGain.connect(ctx.destination);

          audreySourceNodesRef.current.push(source);
          source.onended = () => {
            audreySourceNodesRef.current = audreySourceNodesRef.current.filter(
              (n) => n !== source,
            );
          };

          const now = ctx.currentTime;
          const startAt = Math.max(audreyNextPlayTimeRef.current, now);
          source.start(startAt);
          audreyNextPlayTimeRef.current = startAt + audioBuf.duration;
        } catch (error) {
          console.error("[useAgentAudio] Audrey audio playback error:", error);
        }
      })();

      return;
    }

    // Jason/default agent path.
    if (sourceNodesRef.current.length === 0) {
      if (!firstJasonSpeechRef.current) {
        firstJasonSpeechRef.current = true;
        playSFX("voicebox_activate", 0.7);
        crossfadeMusic("music_intro", 2000);
      }
    }

    (async () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") await ctx.resume();

        // Decode base64 -> raw bytes -> Int16 -> Float32.
        const binary = atob(ev.audio);
        const numSamples = binary.length >> 1;
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
          sourceNodesRef.current = sourceNodesRef.current.filter(
            (n) => n !== source,
          );
        };

        // Gapless chunk scheduling.
        const now = ctx.currentTime;
        const startAt = Math.max(nextPlayTimeRef.current, now);
        source.start(startAt);
        nextPlayTimeRef.current = startAt + audioBuf.duration;
      } catch (error) {
        console.error("[useAgentAudio] Audio playback error:", error);
        dispatchError({
          severity: "recoverable",
          message: "Audio playback was interrupted.",
          context: "agent_speech",
        });
      }
    })();
  }, [audioCtxRef, crossfadeMusic, dispatchError, lastEvent, playSFX]);

  return {
    sourceNodesRef,
    audreySourceNodesRef,
  };
}
