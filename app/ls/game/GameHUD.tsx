"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { useGameWS } from "./GameWSContext";
import { useAudioLayers } from "./useAudioLayers";
import { useGameError } from "./useGameError";
import { ErrorOverlay, ErrorModal } from "./ErrorOverlay";
import type {
  AgentSpeechEvent,
  FmvTriggerEvent,
  HudGlitchEvent,
  TrustUpdateEvent,
  SessionReadyEvent,
  SessionErrorEvent,
  SlotskyTriggerEvent,
  HintEvent,
  SceneImageEvent,
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
  webcamActive = false,
  micDenied = false,
  webcamDenied = false,
  cameraObscured = false,
}: {
  sessionActive?: boolean;
  audioCtxRef: MutableRefObject<AudioContext | null>;
  webcamActive?: boolean;
  micDenied?: boolean;
  webcamDenied?: boolean;
  cameraObscured?: boolean;
}) {
  const {
    lastEvent,
    status,
    sceneImage,
    sceneVideo,
    playerHasSpoken,
    clearSceneVideo,
    send,
  } = useGameWS();
  const glitchRef = useRef<HTMLDivElement>(null);
  const fmvRef = useRef<HTMLVideoElement>(null);
  // nextPlayTimeRef schedules chunks end-to-end for gapless playback.
  const nextPlayTimeRef = useRef<number>(0);
  // All in-flight scheduled source nodes. Cleared on agent_interrupt so Jason
  // stops immediately when the player speaks over him.
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);

  // F1: text hint
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F5: glitch effect
  const [glitchClass, setGlitchClass] = useState<string | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F6: demo end sequence
  const [demoEnded, setDemoEnded] = useState(false);
  const [endOverlayVisible, setEndOverlayVisible] = useState(false);
  const wsCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // F3: crossfade layers
  const [imgLayerA, setImgLayerA] = useState<string | null>(null);
  const [imgLayerB, setImgLayerB] = useState<string | null>(null);
  const [activeImgLayer, setActiveImgLayer] = useState<0 | 1>(0);
  const activeImgLayerRef = useRef<0 | 1>(0);
  const prevSceneImageRef = useRef<string | null>(null);

  // FE-8 / FE-11: scene container overlay states
  const [generatorLit, setGeneratorLit] = useState(false);
  const [generatorAmber, setGeneratorAmber] = useState(false);
  const [generatorFlickering, setGeneratorFlickering] = useState(false);
  const generatorFlickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FE-9: VHS swap state
  const [vhsSwapping, setVhsSwapping] = useState(false);
  const vhsSwapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FE-10: card collectible state
  const [showCard, setShowCard] = useState(false);
  const [cardLabelVisible, setCardLabelVisible] = useState(false);
  const [cardCollecting, setCardCollecting] = useState(false);
  const cardLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hint event (backend B11) — fading text overlay
  const [serverHint, setServerHint] = useState<string | null>(null);
  const serverHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FE-12: Audrey-specific audio nodes (not cancelled by agent_interrupt)
  const audreySourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const audreyNextPlayTimeRef = useRef<number>(0);

  // F4: scene video
  const sceneVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const { errorQueue, dispatchError, dismissError } = useGameError();
  const [cameraNudgeDismissed, setCameraNudgeDismissed] = useState(false);

  // Trust/fear tracking — compare to previous values to detect crossings
  const prevTrustRef = useRef<number>(0.5);
  const prevFearRef = useRef<number>(0.0);
  const fearThresholdsCrossedRef = useRef<Set<number>>(new Set());
  // Fires once when trust first crosses 0.6 upward (resets if trust drops < 0.5)
  const trustKnowledgeFiredRef = useRef(false);
  // Fires voicebox_activate + music_intro on Jason's very first utterance
  const firstJasonSpeechRef = useRef(false);

  // F3: push a new image through the crossfade pipeline
  const pushImage = useCallback((dataUri: string) => {
    const current = activeImgLayerRef.current;
    if (current === 0) {
      setImgLayerB(dataUri);
      requestAnimationFrame(() => {
        setActiveImgLayer(1);
        activeImgLayerRef.current = 1;
      });
    } else {
      setImgLayerA(dataUri);
      requestAnimationFrame(() => {
        setActiveImgLayer(0);
        activeImgLayerRef.current = 0;
      });
    }
  }, []);

  // F4: capture last video frame and push through crossfade, then clear video
  const handleSceneVideoEnded = useCallback(() => {
    const video = sceneVideoRef.current;
    const canvas = canvasRef.current;
    let captured = false;
    if (video && canvas) {
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const frameDataUri = canvas.toDataURL("image/jpeg", 0.85);
          pushImage(frameDataUri);
          captured = true;
        }
      } catch {
        console.warn(
          "[GameHUD] Canvas tainted — video stays frozen on last frame",
        );
      }
    }
    if (captured && video) video.style.display = "none";
    clearSceneVideo();
  }, [clearSceneVideo, pushImage]);

  // FE-9: Apply VHS swap animation just before video ends.
  const handleVideoTimeUpdate = useCallback(() => {
    const video = sceneVideoRef.current;
    if (!video || vhsSwapping) return;
    if (video.duration > 0 && video.currentTime >= video.duration - 0.05) {
      setVhsSwapping(true);
      if (vhsSwapTimerRef.current) clearTimeout(vhsSwapTimerRef.current);
      vhsSwapTimerRef.current = setTimeout(() => {
        setVhsSwapping(false);
        vhsSwapTimerRef.current = null;
      }, 300);
    }
  }, [vhsSwapping]);

  // FE-8 / FE-11: Detect generator scene keys on scene_image events.
  useEffect(() => {
    if (lastEvent?.type !== "scene_image") return;
    const ev = lastEvent as SceneImageEvent;
    const key = ev.payload.sceneKey ?? "";
    const isGeneratorScene =
      key.includes("zone_merge") || key.includes("zone_park_shore");
    if (!isGeneratorScene) return;

    // FE-11: brightness flicker, then fade vignette + warm tint
    setGeneratorFlickering(true);
    if (generatorFlickerTimerRef.current)
      clearTimeout(generatorFlickerTimerRef.current);
    generatorFlickerTimerRef.current = setTimeout(() => {
      setGeneratorFlickering(false);
      setGeneratorLit(true);
      setTimeout(() => setGeneratorAmber(true), 100);
      generatorFlickerTimerRef.current = null;
    }, 1500);
  }, [lastEvent]);

  // hint event (backend B11) — show server-sent hint text for 6s then fade
  useEffect(() => {
    if (lastEvent?.type !== "hint") return;
    const ev = lastEvent as HintEvent;
    setServerHint(ev.text);
    if (serverHintTimerRef.current) clearTimeout(serverHintTimerRef.current);
    serverHintTimerRef.current = setTimeout(() => {
      setServerHint(null);
      serverHintTimerRef.current = null;
    }, 6000);
  }, [lastEvent]);

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
  // FE-12: Audrey audio (audreySourceNodesRef) is NOT cancelled here.
  useEffect(() => {
    if (lastEvent?.type !== "agent_interrupt") return;
    playSFX("barge_in");
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
      `[GameHUD] agent_interrupt — cancelled ${nodes.length} Jason audio nodes (Audrey preserved)`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // F5: HUD Glitch effect — applies full-screen CSS animation per intensity
  useEffect(() => {
    if (lastEvent?.type !== "hud_glitch") return;
    if (demoEnded) return; // no glitches after demo ends
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

    // Clear any in-flight glitch
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
    // F1: fade in text hint after 10 seconds of silence
    hintTimerRef.current = setTimeout(() => setShowHint(true), 10000);
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // F1: hide text hint once player speaks
  useEffect(() => {
    if (playerHasSpoken) {
      setShowHint(false);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    }
  }, [playerHasSpoken]);

  // F3: crossfade scene images when sceneImage changes
  useEffect(() => {
    if (demoEnded) return; // F6: freeze scene after demo ends
    if (sceneImage === prevSceneImageRef.current) return;
    prevSceneImageRef.current = sceneImage;
    if (!sceneImage) return;
    pushImage(`data:image/jpeg;base64,${sceneImage}`);
    // Hide any leftover frozen video from F4
    if (sceneVideoRef.current) sceneVideoRef.current.style.display = "none";
  }, [sceneImage, pushImage, demoEnded]);

  // F4: play scene video when sceneVideo arrives
  useEffect(() => {
    if (demoEnded) return; // F6: no new videos after demo ends
    if (!sceneVideo) return;
    const video = sceneVideoRef.current;
    if (!video) return;
    video.src = sceneVideo.url;
    video.style.display = "block";
    video
      .play()
      .catch((e) => console.error("[GameHUD] scene_video play error:", e));
  }, [sceneVideo, demoEnded]);

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
    if (
      trust_level >= 0.6 &&
      prevTrust < 0.6 &&
      !trustKnowledgeFiredRef.current
    ) {
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
        // FE-10: play SFX + show card collectible overlay
        playSFX("slotsky_cards");
        setShowCard(true);
        setCardLabelVisible(false);
        if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
        cardLabelTimerRef.current = setTimeout(() => {
          setCardLabelVisible(true);
          cardLabelTimerRef.current = null;
        }, 2000);
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
        // F6: Demo end sequence
        // 1. Stop all audio layers
        stopMusic(500);
        stopAmbientLoop(500);
        playSFX("proximity_found");
        // 2. Freeze scene — block all future image/video transitions
        setDemoEnded(true);
        // 3. After 2s: fade in end title overlay
        setTimeout(() => setEndOverlayVisible(true), 2000);
        // 4. After 7s: close WS gracefully
        wsCloseTimerRef.current = setTimeout(() => {
          send({ type: "session_end" });
        }, 7000);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // Agent audio playback — raw 16-bit little-endian PCM at 24kHz from Gemini Live.
  // decodeAudioData() only handles encoded formats (MP3/WAV) — must decode PCM manually.
  // FE-12: Audrey uses a separate path with reverb + delay; not cancelled by agent_interrupt.
  useEffect(() => {
    if (lastEvent?.type !== "agent_speech") return;
    const ev = lastEvent as AgentSpeechEvent;
    if (!ev.audio) return;

    // FE-12: Route Audrey through echo pipeline
    if (ev.agent === "audrey") {
      (async () => {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === "suspended") await ctx.resume();

          // Decode PCM
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

          // Build reverb impulse response (cached lazily per AudioContext)
          const impulseLen = Math.floor(ctx.sampleRate * 1.5);
          const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate);
          for (let ch = 0; ch < 2; ch++) {
            const d = impulse.getChannelData(ch);
            for (let i = 0; i < impulseLen; i++) {
              d[i] =
                (Math.random() * 2 - 1) *
                Math.pow(1 - i / impulseLen, 2);
            }
          }
          const convolver = ctx.createConvolver();
          convolver.buffer = impulse;

          const delay = ctx.createDelay(0.5);
          delay.delayTime.value = 0.15;

          // Routing: source → outputGain → dry(0.4) → dest
          //                               → delay → convolver → wet(0.6) → dest
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
        } catch (e) {
          console.error("[GameHUD] Audrey audio playback error:", e);
        }
      })();
      return;
    }

    // Jason / default agent path
    // Detect start of a new utterance (audio queue was empty when this chunk arrived).
    // First-ever utterance: voicebox_activate + crossfade to intro music.
    // Subsequent utterances: transmission ping.
    if (sourceNodesRef.current.length === 0) {
      if (!firstJasonSpeechRef.current) {
        firstJasonSpeechRef.current = true;
        playSFX("voicebox_activate", 0.7);
        crossfadeMusic("music_intro", 2000);
      } else {
        playSFX("transmission_ping", 0.7);
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
          sourceNodesRef.current = sourceNodesRef.current.filter(
            (n) => n !== source,
          );
        };

        // Schedule gapless: each chunk starts exactly where the previous ended
        const now = ctx.currentTime;
        const startAt = Math.max(nextPlayTimeRef.current, now);
        source.start(startAt);
        nextPlayTimeRef.current = startAt + audioBuf.duration;
      } catch (e) {
        console.error("[GameHUD] Audio playback error:", e);
        dispatchError({
          severity: "recoverable",
          message: "Audio playback was interrupted.",
          context: "agent_speech",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // End session helper — graceful WS close then reload
  const handleEndSession = useCallback(() => {
    send({ type: "session_end" });
    setTimeout(() => window.location.reload(), 500);
  }, [send]);

  // WS error state → fatal error card
  useEffect(() => {
    if (status !== "error") return;
    dispatchError({
      severity: "fatal",
      message: "The connection was lost. The backend may be unreachable.",
      context: "ws_error",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // session_error server event → fatal error card
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

  // Mic denied → fatal error card (mic is required)
  useEffect(() => {
    if (!micDenied) return;
    dispatchError({
      severity: "fatal",
      message:
        "Microphone access was denied. This experience requires your voice. We apologise — the session cannot continue.",
      context: "mic_denied",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micDenied]);

  // Latest trust data for the HUD indicator
  const trustEvent =
    lastEvent?.type === "trust_update" ? (lastEvent as TrustUpdateEvent) : null;

  return (
    <div
      className="absolute inset-0"
      style={
        glitchClass
          ? {
              animation:
                glitchClass === "hud-glitch-active-low"
                  ? "hud-glitch-low 0.08s steps(2) infinite"
                  : glitchClass === "hud-glitch-active-medium"
                    ? "hud-glitch-medium 0.12s steps(3) infinite"
                    : "hud-glitch-high 0.1s steps(4) infinite",
            }
          : undefined
      }
    >
      {/* ── Scene image crossfade layers + FE-8 vignette (F3) ── */}
      <div
        className={[
          "scene-container",
          generatorLit ? "generator-lit" : "",
          generatorAmber ? "generator-amber" : "",
          generatorFlickering ? "generator-flicker-anim" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {imgLayerA && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgLayerA}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
            style={{ opacity: activeImgLayer === 0 ? 1 : 0 }}
          />
        )}
        {imgLayerB && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgLayerB}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
            style={{ opacity: activeImgLayer === 1 ? 1 : 0 }}
          />
        )}
      </div>

      {/* ── Scene video overlay (F4 + FE-9 VHS swap) ──────── */}
      <video
        ref={sceneVideoRef}
        className={[
          "absolute inset-0 w-full h-full object-cover z-[5]",
          vhsSwapping ? "vhs-swap" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ display: "none" }}
        playsInline
        muted
        crossOrigin="anonymous"
        onEnded={handleSceneVideoEnded}
        onTimeUpdate={handleVideoTimeUpdate}
      />
      <canvas ref={canvasRef} className="hidden" />

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
            backgroundImage: "url('/assets/images/cracked-glass.png')",
            backgroundSize: "cover",
            opacity: 0,
          }}
        />
      )}

      {/* ── F5: Glitch color/scanline overlay (high intensity only) ── */}
      {glitchClass === "hud-glitch-active-high" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 hud-glitch-scanlines"
          style={{ backgroundColor: "rgba(255, 0, 0, 0.06)" }}
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

      {/* ── "say something..." text hint (F1) ─────────────── */}
      {showHint && !playerHasSpoken && (
        <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
          <p
            className="font-mono text-sm tracking-[0.3em] uppercase"
            style={{
              color: "rgba(160,160,160,0.5)",
              animation: "hint-fade-in 2s ease-in forwards",
            }}
          >
            say something...
          </p>
        </div>
      )}

      {/* ── Backend hint text overlay (B11) ─────────────── */}
      {serverHint && (
        <div className="absolute inset-0 z-[26] flex items-end justify-center pb-16 pointer-events-none">
          <p
            className="font-mono text-sm tracking-[0.2em] uppercase text-center max-w-md px-4"
            style={{
              color: "rgba(192,132,252,0.75)",
              animation: "hint-fade-in 1s ease-in forwards",
              textShadow: "0 0 12px rgba(139,44,245,0.4)",
            }}
          >
            {serverHint}
          </p>
        </div>
      )}

      {/* ── GM Eye indicator (F2 redesign) ─────────────── */}
      {/* Only visible when session is active, WS is open, AND webcam is capturing */}
      {sessionActive && status === "open" && webcamActive && !demoEnded && (
        <div
          aria-hidden="true"
          className="absolute top-5 right-5 z-40"
          style={{ animation: "gm-eye-breathe 3.5s ease-in-out infinite" }}
        >
          <svg
            width="44"
            height="28"
            viewBox="0 0 44 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer eye shape */}
            <path
              d="M2 14C2 14 10 2 22 2C34 2 42 14 42 14C42 14 34 26 22 26C10 26 2 14 2 14Z"
              stroke="#dc2626"
              strokeWidth="1.5"
              fill="rgba(220, 38, 38, 0.08)"
            />
            {/* Iris */}
            <circle cx="22" cy="14" r="7" fill="#991b1b" />
            <circle
              cx="22"
              cy="14"
              r="5"
              fill="#dc2626"
              style={{
                animation: "gm-eye-iris-pulse 3.5s ease-in-out infinite",
              }}
            />
            {/* Pupil */}
            <circle cx="22" cy="14" r="2.5" fill="#0a0a0a" />
            {/* Glint */}
            <circle cx="19" cy="11.5" r="1" fill="rgba(255,255,255,0.5)" />
          </svg>
          {/* Red glow behind the eye */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              filter: "blur(8px)",
              background:
                "radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

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

      {/* ── FE-10: Card collectible overlay ────────────────── */}
      {showCard && !demoEnded && (
        <div
          className="absolute bottom-8 right-8 z-[45] flex flex-col items-center gap-3 pointer-events-auto"
          style={{
            animation: cardCollecting ? "card-slide-out 0.5s ease-in forwards" : undefined,
          }}
          onClick={() => {
            if (cardCollecting) return;
            setCardCollecting(true);
            if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
            setTimeout(() => setShowCard(false), 500);
            const wsSessionId =
              (lastEvent as { sessionId?: string } | null)?.sessionId ?? "";
            send({ type: "card_collected", sessionId: wsSessionId });
          }}
        >
          {/* Queen of Spades SVG */}
          <div
            style={{
              animation: cardCollecting
                ? undefined
                : "card-glow-pulse 1.8s ease-in-out infinite",
              cursor: "pointer",
            }}
          >
            <svg
              width="80"
              height="112"
              viewBox="0 0 80 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Queen of Spades"
            >
              <rect
                width="80"
                height="112"
                rx="6"
                fill="#0e0e1a"
                stroke="rgba(139,44,245,0.7)"
                strokeWidth="1.5"
              />
              {/* Rank + suit corners */}
              <text
                x="6"
                y="16"
                fill="white"
                fontFamily="serif"
                fontSize="12"
                fontWeight="bold"
              >
                Q
              </text>
              <text x="6" y="28" fill="white" fontFamily="serif" fontSize="10">
                ♠
              </text>
              {/* Centre spade */}
              <text
                x="40"
                y="68"
                fill="white"
                fontFamily="serif"
                fontSize="48"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                ♠
              </text>
            </svg>
          </div>

          {/* "pick it up?" label — fades in after 2s */}
          {cardLabelVisible && !cardCollecting && (
            <p
              className="font-mono text-xs tracking-[0.25em] uppercase"
              style={{
                color: "rgba(192,132,252,0.8)",
                animation: "hint-fade-in 0.8s ease-in forwards",
              }}
            >
              pick it up?
            </p>
          )}
        </div>
      )}

      {/* ── F6: Demo end overlay ────────────────────────── */}
      {endOverlayVisible && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/80"
          style={{ animation: "demo-end-fade-in 1.5s ease-in forwards" }}
        >
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-[0.3em] uppercase mb-6"
            style={{
              textShadow:
                "0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(139,44,245,0.3)",
            }}
          >
            LIMINAL SIN
          </h1>
          <p
            className="font-mono text-sm tracking-[0.4em] uppercase"
            style={{ color: "rgba(192,132,252,0.7)" }}
          >
            experience complete
          </p>
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

      {/* ── Camera obscured nudge (non-blocking, dismissible) ─ */}
      {cameraObscured &&
        !webcamDenied &&
        sessionActive &&
        !cameraNudgeDismissed && (
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-3 px-4 py-2 font-mono text-xs"
            style={{
              background: "rgba(10,10,10,0.9)",
              border: "1px solid rgba(220,38,38,0.5)",
            }}
          >
            <span className="text-red-400">⚠</span>
            <span className="text-red-300/80">
              Camera appears covered. The GM is watching.
            </span>
            <button
              onClick={() => setCameraNudgeDismissed(true)}
              className="text-red-500/50 hover:text-red-400 ml-1"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

      {/* ── Webcam denied indicator (informational) ─────────── */}
      {webcamDenied && sessionActive && (
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[55] px-4 py-2 font-mono text-[10px] tracking-widest uppercase"
          style={{
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "rgba(220,38,38,0.6)",
          }}
        >
          Camera offline — audio only
        </div>
      )}

      {/* ── Error toast stack + fatal modals ────────────────── */}
      <ErrorOverlay
        errorQueue={errorQueue}
        onDismiss={dismissError}
        onEndSession={handleEndSession}
      />

      {/* ── Mic blocked modal (overrides ErrorOverlay for mic denial) ── */}
      {micDenied && !demoEnded && (
        <ErrorModal
          title="No Signal"
          message="Microphone access was denied. This experience requires your voice to proceed. We apologise — the session cannot continue without it."
          onEndSession={handleEndSession}
        />
      )}
    </div>
  );
}
