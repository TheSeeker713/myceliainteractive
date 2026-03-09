"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGameWS } from "./GameWSContext";

/**
 * usePlayerMedia — Captures microphone and webcam, emits events to the backend.
 *
 * Mic audio is captured in ~2s chunks via MediaRecorder and sent as base64
 * player_speech events.
 * Webcam frames are captured at 1 FPS via a hidden canvas and sent as base64
 * player_frame JPEG events.
 *
 * Per TEAM_CONTRACT.md §2 this hook owns ONLY the transport of raw media.
 * It never makes decisions about the content.
 */
export function usePlayerMedia(active: boolean) {
  const { send, status } = useGameWS();
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Guard: getUserMedia must only be called once per session activation.
  // Without this, any status change while active===true re-triggers the effect,
  // stopAll() closes the AudioContext (fire-and-forget), and the next
  // getUserMedia call races with the pending close → NotReadableError: Device in use.
  const captureStartedRef = useRef(false);

  const stopAll = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    void micCtxRef.current?.close();
    micCtxRef.current = null;
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!active || status !== "open") return;
    if (captureStartedRef.current) return; // already capturing — do not re-enter
    captureStartedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: "user", width: 320, height: 240 },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        // ── Microphone: ScriptProcessor → raw PCM 16kHz Int16 ────────────────
        // Gemini Live requires audio/pcm;rate=16000 — raw linear PCM only.
        // We request sampleRate:16000 but Chrome may silently use its native rate
        // (usually 48kHz). We detect the actual rate and manually downsample so
        // Gemini always receives correctly-labeled 16kHz PCM.
        const micCtx = new AudioContext({ sampleRate: 16000 });
        await micCtx.resume(); // ensure not suspended even for an input-only context
        micCtxRef.current = micCtx;
        const actualRate = micCtx.sampleRate; // may differ from 16000
        console.log(`[usePlayerMedia] AudioContext sampleRate: ${actualRate}`);
        const micSource = micCtx.createMediaStreamSource(stream);
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const processor = micCtx.createScriptProcessor(4096, 1, 1);
        micSource.connect(processor);
        processor.connect(micCtx.destination); // must be connected to fire onaudioprocess

        processor.onaudioprocess = (e) => {
          const raw32 = e.inputBuffer.getChannelData(0);

          // If Chrome honored sampleRate:16000, raw32 IS 16kHz — use directly.
          // If Chrome used its native rate instead, downsample to 16kHz explicitly.
          let pcm16k: Float32Array;
          if (actualRate === 16000) {
            pcm16k = raw32;
          } else {
            const ratio = actualRate / 16000;
            const outLen = Math.floor(raw32.length / ratio);
            pcm16k = new Float32Array(outLen);
            for (let i = 0; i < outLen; i++) {
              pcm16k[i] = raw32[Math.round(i * ratio)];
            }
          }

          const int16 = new Int16Array(pcm16k.length);
          for (let i = 0; i < pcm16k.length; i++) {
            const s = Math.max(-1, Math.min(1, pcm16k[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          // Encode in 32KB chunks to avoid call-stack overflow on spread
          const bytes = new Uint8Array(int16.buffer);
          let raw = "";
          for (let i = 0; i < bytes.length; i += 0x8000) {
            raw += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
          }
          send({ type: "player_speech", audio: btoa(raw), timestamp: Date.now() });
        };

        // ── Webcam: canvas snapshot at 1 FPS ─────────────
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        canvasRef.current = canvas;

        const video = document.createElement("video");
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        videoRef.current = video;
        await video.play();

        frameIntervalRef.current = setInterval(() => {
          const ctx2d = canvas.getContext("2d");
          if (!ctx2d || video.readyState < 2) return;
          ctx2d.drawImage(video, 0, 0, 320, 240);
          // Extract as JPEG base64, strip data URI prefix
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          const b64 = dataUrl.split(",")[1];
          if (b64) {
            send({ type: "player_frame", jpeg: b64, timestamp: Date.now() });
          }
        }, 1000); // 1 FPS
      } catch (err) {
        console.error("[usePlayerMedia] Media access error:", err);
      }
    })();

    return () => {
      cancelled = true;
      stopAll();
      captureStartedRef.current = false; // allow re-init if session restarts
    };
  }, [active, status, send, stopAll]);

  return { stopAll };
}
