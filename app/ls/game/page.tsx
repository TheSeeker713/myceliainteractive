"use client";

import { useEffect, useRef, useState } from "react";
import { GameWSProvider, useGameWS } from "./GameWSContext";
import GameHUD from "./GameHUD";
import { usePlayerMedia } from "./usePlayerMedia";
import { GameErrorBoundary } from "./GameErrorBoundary";
import { IntroSequence } from "./IntroSequence";


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
    "waiting" | "connecting" | "intro" | "active"
  >("waiting");
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [grantingPerms, setGrantingPerms] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const sessionActive = sessionPhase === "intro" || sessionPhase === "active";
  const { connect, lastEvent } = useGameWS();
  // Single shared AudioContext for the whole session — passed to both GameHUD
  // (playback) and usePlayerMedia (mic capture) to avoid iOS's concurrent
  // AudioContext limit.
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Start media capture once the user explicitly starts the session
  const { webcamActive, micDenied, webcamDenied, cameraObscured, stopAll } =
    usePlayerMedia(sessionActive, audioCtxRef);

  // Check if permissions already granted — show PLAY directly if so
  useEffect(() => {
    let cancelled = false;

    async function checkMediaPermissions() {
      if (!navigator.permissions?.query) {
        if (!cancelled) setPermissionsChecked(true);
        return;
      }

      try {
        const [mic, cam] = await Promise.all([
          navigator.permissions.query({ name: "microphone" as PermissionName }),
          navigator.permissions.query({ name: "camera" as PermissionName }),
        ]);

        if (!cancelled) {
          setPermissionsGranted(
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

  // Backend sends session_ready once GM + NPCs are initialised → start credits
  useEffect(() => {
    if (lastEvent?.type !== "session_ready") return;
    if (sessionPhase === "connecting") setSessionPhase("intro");
  }, [lastEvent, sessionPhase]);

  async function handleGrantPermissions() {
    setGrantingPerms(true);
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      setPermissionsGranted(true);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.getTracks().forEach((t) => t.stop());
          // Webcam denied but mic allowed — continue (webcam is non-fatal)
          setPermissionsGranted(true);
        } catch {
          setPermissionError("Microphone access is required to proceed.");
        }
      } else {
        setPermissionError(
          "Could not access your devices. Please check your browser settings.",
        );
      }
    } finally {
      setGrantingPerms(false);
    }
  }

  function handlePlay() {
    connect();
    setSessionPhase("connecting");
  }

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

      {/* ── Onboarding screen ───────────────────────────────────────── */}
      {sessionPhase === "waiting" && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black px-6"
          style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-2"
            style={{ color: "rgba(192,132,252,0.6)" }}
          >
            Mycelia Interactive
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: "0 0 30px rgba(255,0,50,0.4)" }}
          >
            LIMINAL SIN
          </h1>

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

          {permissionError && (
            <p
              className="text-xs tracking-wider text-center max-w-xs"
              style={{ color: "rgba(220,38,38,0.8)" }}
            >
              {permissionError}
            </p>
          )}

          {!permissionsChecked ? (
            <button
              disabled
              className="mt-2 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm opacity-50 cursor-not-allowed"
            >
              Checking devices…
            </button>
          ) : permissionsGranted ? (
            <button
              onClick={handlePlay}
              className="mt-2 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
            >
              PLAY
            </button>
          ) : (
            <button
              onClick={handleGrantPermissions}
              disabled={grantingPerms}
              className="mt-2 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {grantingPerms ? "Awaiting permissions…" : "GRANT PERMISSIONS"}
            </button>
          )}
        </div>
      )}

      {/* ── Connecting screen (waiting for session_ready from backend) ─ */}
      {sessionPhase === "connecting" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <p
            className="text-xs tracking-[0.45em] uppercase animate-pulse"
            style={{
              color: "rgba(192,132,252,0.35)",
              fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            }}
          >
            connecting…
          </p>
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
