"use client";

import { useEffect, useRef, useState } from "react";
import { GameWSProvider, useGameWS } from "./GameWSContext";
import GameHUD from "./GameHUD";
import { usePlayerMedia } from "./usePlayerMedia";
import { GameErrorBoundary } from "./GameErrorBoundary";
import { IntroSequence } from "./IntroSequence";

/**
 * FE-13: Permission gate shown between "waiting" and "intro" phases.
 * Pre-grants mic/cam so usePlayerMedia's real capture never triggers a second browser prompt.
 */
function PermissionsGate({ onGranted }: { onGranted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAllow() {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      // Release immediately — this just pre-grants the browser permission.
      stream.getTracks().forEach((t) => t.stop());
      onGranted();
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        // Distinguish mic vs webcam denial
        // Try audio-only to check if mic is the blocker
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          audioStream.getTracks().forEach((t) => t.stop());
          // Webcam denied but mic allowed — continue (webcam is non-fatal)
          onGranted();
        } catch {
          setError("Microphone access is required to proceed.");
          setLoading(false);
        }
      } else {
        setError(
          "Could not access your devices. Please check your browser settings.",
        );
        setLoading(false);
      }
    }
  }

  return (
    <div
      className="absolute inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-black px-6"
      style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
    >
      <p
        className="text-xs tracking-[0.35em] uppercase mb-2"
        style={{ color: "rgba(192,132,252,0.6)" }}
      >
        Mycelia Interactive
      </p>

      {/* Privacy disclaimer */}
      <div
        className="max-w-sm text-center text-xs leading-relaxed"
        style={{ color: "rgba(160,160,160,0.65)" }}
      >
        <p>
          Mycelia Interactive does not store, sell, or share your camera or
          microphone data. Audio and video are processed in real-time via
          Google&apos;s Gemini API solely to power this experience. No
          recordings are retained after your session ends.
        </p>
        <a
          href="/ls/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block tracking-widest uppercase text-[10px] hover:text-purple-300 transition-colors duration-200"
          style={{ color: "rgba(192,132,252,0.5)" }}
        >
          Privacy Policy ↗
        </a>
      </div>

      {/* Error message */}
      {error && (
        <p
          className="text-xs tracking-wider text-center max-w-xs"
          style={{ color: "rgba(220,38,38,0.8)" }}
        >
          {error}
        </p>
      )}

      {/* Allow button */}
      <button
        onClick={handleAllow}
        disabled={loading}
        className="mt-2 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Awaiting permissions…" : "Allow Access & Continue"}
      </button>
    </div>
  );
}

/**
 * Game UI Shell — /ls/game
 *
 * Dumb terminal. Sends player input, renders what the backend tells it.
 * All game logic lives in liminal-sin-gemini.
 *
 * Per TEAM_CONTRACT.md §2 and AGENTS.md §4:
 * This page must NEVER embed agent decisions, trust logic, or narrative state.
 */

function GameInner() {
  const [sessionPhase, setSessionPhase] = useState<
    "waiting" | "permissions" | "ready" | "intro" | "active"
  >("waiting");
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [canStartDirectly, setCanStartDirectly] = useState(false);
  const sessionActive = sessionPhase === "intro" || sessionPhase === "active";
  const { connect } = useGameWS();
  // Single shared AudioContext for the whole session — passed to both GameHUD
  // (playback) and usePlayerMedia (mic capture) to avoid iOS's concurrent
  // AudioContext limit.
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Start media capture once the user explicitly starts the session
  const { webcamActive, micDenied, webcamDenied, cameraObscured, stopAll } =
    usePlayerMedia(sessionActive, audioCtxRef);

  useEffect(() => {
    let cancelled = false;

    async function checkMediaPermissions() {
      if (!navigator.permissions?.query) {
        if (!cancelled) setPermissionsChecked(true);
        return;
      }

      try {
        const [mic, cam] = await Promise.all([
          navigator.permissions.query({
            name: "microphone" as PermissionName,
          }),
          navigator.permissions.query({
            name: "camera" as PermissionName,
          }),
        ]);

        if (!cancelled) {
          setCanStartDirectly(
            mic.state === "granted" && cam.state === "granted",
          );
        }
      } catch {
        // Graceful fallback for browsers with partial/blocked Permissions API support.
      } finally {
        if (!cancelled) setPermissionsChecked(true);
      }
    }

    checkMediaPermissions();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* HUD overlays + FMV layer + audio playback */}
      <GameHUD
        sessionActive={sessionActive}
        audioCtxRef={audioCtxRef}
        webcamActive={webcamActive}
        micDenied={micDenied}
        webcamDenied={webcamDenied}
        cameraObscured={cameraObscured}
        onStopMedia={stopAll}
      />

      {/* ── Cinematic intro sequence ────────────────────── */}
      {sessionPhase === "intro" && (
        <IntroSequence
          audioCtxRef={audioCtxRef}
          onComplete={() => setSessionPhase("active")}
        />
      )}

      {/* ── Start prompt (shown before session begins) ─── */}
      {sessionPhase === "waiting" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90">
          <p
            className="text-xs tracking-[0.35em] uppercase"
            style={{
              color: "rgba(192,132,252,0.6)",
              fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            }}
          >
            Liminal Sin — Session Ready
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: "0 0 30px rgba(255,0,50,0.4)" }}
          >
            ENTER
          </h1>
          <p className="text-sm text-gray-400 font-mono max-w-xs text-center leading-relaxed">
            Microphone and camera access required. You will be heard. You will
            be seen.
          </p>
          <button
            onClick={() => {
              if (canStartDirectly) {
                setSessionPhase("ready");
                return;
              }

              setSessionPhase("permissions");
            }}
            disabled={!permissionsChecked}
            className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
          >
            {permissionsChecked
              ? canStartDirectly
                ? "Play"
                : "Begin Session"
              : "Checking devices…"}
          </button>
        </div>
      )}

      {/* ── FE-13: Permission gate + privacy disclaimer ─── */}
      {sessionPhase === "permissions" && (
        <PermissionsGate
          onGranted={() => {
            setCanStartDirectly(true);
            setSessionPhase("ready");
          }}
        />
      )}

      {/* ── Ready gate (shown after permissions are granted) ─── */}
      {sessionPhase === "ready" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90">
          <p
            className="text-xs tracking-[0.35em] uppercase"
            style={{
              color: "rgba(192,132,252,0.6)",
              fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            }}
          >
            Liminal Sin — Systems Online
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: "0 0 30px rgba(255,0,50,0.4)" }}
          >
            PLAY
          </h1>
          <p className="text-sm text-gray-400 font-mono max-w-xs text-center leading-relaxed">
            Camera and microphone are ready.
          </p>
          <button
            onClick={() => {
              connect();
              setSessionPhase("intro");
            }}
            className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <GameErrorBoundary>
      <GameWSProvider judgeMode={false}>
        <GameInner />
      </GameWSProvider>
    </GameErrorBoundary>
  );
}
