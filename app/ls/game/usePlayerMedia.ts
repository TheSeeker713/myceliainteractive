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
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopAll = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!active || status !== "open") return;

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

        // ── Microphone: MediaRecorder in 2s chunks ────────
        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm",
        });
        recorderRef.current = recorder;

        recorder.ondataavailable = async (e) => {
          if (e.data.size === 0) return;
          const arrayBuf = await e.data.arrayBuffer();
          const b64 = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuf))
          );
          send({ type: "player_speech", audio: b64, timestamp: Date.now() });
        };

        recorder.start(2000); // emit every 2 seconds

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
    };
  }, [active, status, send, stopAll]);

  return { stopAll };
}
