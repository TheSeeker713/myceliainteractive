"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useGameWS } from "./GameWSContext";

type SendFn = ReturnType<typeof useGameWS>["send"];

/** ScriptProcessorNode fallback for browsers without AudioWorklet support. */
function setupScriptProcessor(
  ctx: AudioContext,
  source: MediaStreamAudioSourceNode,
  actualRate: number,
  targetRate: number,
  send: SendFn,
) {
  const processor = ctx.createScriptProcessor(4096, 1, 1);
  source.connect(processor);
  processor.connect(ctx.destination); // must be connected to fire onaudioprocess

  processor.onaudioprocess = (e: AudioProcessingEvent) => {
    const raw32 = e.inputBuffer.getChannelData(0);

    let pcm16k: Float32Array;
    if (actualRate === targetRate) {
      pcm16k = raw32;
    } else {
      const ratio = actualRate / targetRate;
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
}

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

        // ── Microphone: AudioWorkletNode → raw PCM 16kHz Int16 ─────────────
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

        // AudioWorkletNode replaces deprecated ScriptProcessorNode.
        // The worklet runs on the audio thread — lower latency, no main-thread jank.
        // Blob URL avoids a separate file; fallback to ScriptProcessor for old browsers.
        const targetRate = 16000;
        const sendRef = send; // capture for worklet message handler

        if (typeof AudioWorkletNode !== "undefined" && micCtx.audioWorklet) {
          try {
            const processorCode = `
              class PCMProcessor extends AudioWorkletProcessor {
                constructor() {
                  super();
                }
                process(inputs) {
                  const input = inputs[0];
                  if (!input || !input[0] || input[0].length === 0) return true;
                  const raw32 = input[0];
                  // Downsample to 16kHz if needed
                  const ratio = sampleRate / ${targetRate};
                  let pcm16k;
                  if (sampleRate === ${targetRate}) {
                    pcm16k = raw32;
                  } else {
                    const outLen = Math.floor(raw32.length / ratio);
                    pcm16k = new Float32Array(outLen);
                    for (let i = 0; i < outLen; i++) {
                      pcm16k[i] = raw32[Math.round(i * ratio)];
                    }
                  }
                  // Convert to Int16
                  const int16 = new Int16Array(pcm16k.length);
                  for (let i = 0; i < pcm16k.length; i++) {
                    const s = Math.max(-1, Math.min(1, pcm16k[i]));
                    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                  }
                  this.port.postMessage(int16.buffer, [int16.buffer]);
                  return true;
                }
              }
              registerProcessor("pcm-processor", PCMProcessor);
            `;
            const blob = new Blob([processorCode], { type: "application/javascript" });
            const workletUrl = URL.createObjectURL(blob);
            await micCtx.audioWorklet.addModule(workletUrl);
            URL.revokeObjectURL(workletUrl);

            const workletNode = new AudioWorkletNode(micCtx, "pcm-processor");
            micSource.connect(workletNode);
            workletNode.connect(micCtx.destination);

            workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
              const bytes = new Uint8Array(e.data);
              let raw = "";
              for (let i = 0; i < bytes.length; i += 0x8000) {
                raw += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
              }
              sendRef({
                type: "player_speech",
                audio: btoa(raw),
                timestamp: Date.now(),
              });
            };

            console.log("[usePlayerMedia] AudioWorkletNode active");
          } catch (workletErr) {
            console.warn("[usePlayerMedia] AudioWorklet failed, falling back to ScriptProcessor:", workletErr);
            setupScriptProcessor(micCtx, micSource, actualRate, targetRate, sendRef);
          }
        } else {
          console.warn("[usePlayerMedia] AudioWorklet not supported, using ScriptProcessor");
          setupScriptProcessor(micCtx, micSource, actualRate, targetRate, sendRef);
        }

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
          await video.play().catch((e) => {
            if ((e as DOMException).name !== "AbortError") throw e;
          });

          darkFrameCountRef.current = 0;
          frameIntervalRef.current = setInterval(() => {
            const ctx2d = canvas.getContext("2d", { willReadFrequently: true });
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
