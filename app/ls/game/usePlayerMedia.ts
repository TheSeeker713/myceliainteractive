"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
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
export function usePlayerMedia(
  active: boolean,
  sharedCtxRef: RefObject<AudioContext | null>,
) {
  const { send, status } = useGameWS();
  const streamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [webcamDenied, setWebcamDenied] = useState(false);
  const [cameraObscured, setCameraObscured] = useState(false);
  const darkFrameCountRef = useRef(0);
  // Guard: getUserMedia must only be called once per session activation.
  // Without this, any status change while active===true re-triggers the effect,
  // stopAll() closes the AudioContext (fire-and-forget), and the next
  // getUserMedia call races with the pending close → NotReadableError: Device in use.
  const captureStartedRef = useRef(false);

  const stopAll = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    videoStreamRef.current?.getTracks().forEach((t) => t.stop());
    videoStreamRef.current = null;
    setWebcamActive(false);
    setMicActive(false);
  }, []);

  useEffect(() => {
    if (!active || status !== "open") return;
    if (captureStartedRef.current) return; // already capturing — do not re-enter
    captureStartedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        // Step I: Mic first (fatal if denied), webcam second (non-blocking if denied).
        // Splitting getUserMedia lets us distinguish which device failed.
        let audioStream: MediaStream;
        try {
          try {
            audioStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 16000,
              },
              video: false,
            });
          } catch {
            // iOS Safari may reject the sampleRate constraint — retry without it.
            audioStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
              video: false,
            });
          }
        } catch {
          if (cancelled) return;
          setMicDenied(true);
          return; // Fatal — mic is required for this experience
        }

        if (cancelled) {
          audioStream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = audioStream;
        setMicActive(true);

        // Detect if mic track ends mid-session (e.g. device unplugged)
        const audioTrack = audioStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.onended = () => {
            setMicDenied(true);
            setMicActive(false);
          };
        }

        // ── Microphone: ScriptProcessor → raw PCM 16kHz Int16 ────────────────
        // Gemini Live requires audio/pcm;rate=16000 — raw linear PCM only.
        // Step H: Reuse the shared AudioContext (24kHz) created by GameHUD inside
        // the Begin Session gesture. iOS Safari silently suspends a second
        // concurrent AudioContext — sharing one avoids that failure mode.
        // The downsample logic below handles any rate != 16000.
        const micCtx = sharedCtxRef.current;
        if (!micCtx) {
          console.error(
            "[usePlayerMedia] Shared AudioContext not ready — aborting mic setup",
          );
          return;
        }
        const actualRate = micCtx.sampleRate; // 24000 from shared ctx; downsampled below
        console.log(`[usePlayerMedia] AudioContext sampleRate: ${actualRate}`);
        const micSource = micCtx.createMediaStreamSource(audioStream);

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
          send({
            type: "player_speech",
            audio: btoa(raw),
            timestamp: Date.now(),
          });
        };

        // ── Webcam: optional, non-blocking if denied ──────────
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 320, height: 240 },
            audio: false,
          });

          if (cancelled) {
            videoStream.getTracks().forEach((t) => t.stop());
            return;
          }

          videoStreamRef.current = videoStream;

          const canvas = document.createElement("canvas");
          canvas.width = 320;
          canvas.height = 240;
          canvasRef.current = canvas;

          const video = document.createElement("video");
          video.srcObject = videoStream;
          video.muted = true;
          video.playsInline = true;
          videoRef.current = video;
          await video.play();

          darkFrameCountRef.current = 0;
          frameIntervalRef.current = setInterval(() => {
            const ctx2d = canvas.getContext("2d");
            if (!ctx2d || video.readyState < 2) return;
            ctx2d.drawImage(video, 0, 0, 320, 240);

            // Brightness analysis — quarter-res sample (80×60 ≈ 4800 px, fast at 1 FPS)
            const imageData = ctx2d.getImageData(0, 0, 80, 60);
            let brightnessSum = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
              brightnessSum +=
                (imageData.data[i] +
                  imageData.data[i + 1] +
                  imageData.data[i + 2]) /
                3;
            }
            const avgBrightness = brightnessSum / (imageData.data.length / 4);
            if (avgBrightness < 20) {
              darkFrameCountRef.current++;
              if (darkFrameCountRef.current >= 3) setCameraObscured(true);
            } else {
              darkFrameCountRef.current = 0;
              setCameraObscured(false);
            }

            // Send frame to backend for GM vision
            const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
            const b64 = dataUrl.split(",")[1];
            if (b64) {
              send({ type: "player_frame", jpeg: b64, timestamp: Date.now() });
            }
          }, 1000); // 1 FPS

          // Webcam is now actively capturing
          setWebcamActive(true);
        } catch {
          setWebcamDenied(true);
          // Webcam denied — game continues with mic only
        }
      } catch (err) {
        console.error("[usePlayerMedia] Media access error:", err);
      }
    })();

    return () => {
      cancelled = true;
      stopAll();
      captureStartedRef.current = false; // allow re-init if session restarts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, status, send, stopAll]);

  return {
    stopAll,
    webcamActive,
    micDenied,
    micActive,
    webcamDenied,
    cameraObscured,
  };
}
