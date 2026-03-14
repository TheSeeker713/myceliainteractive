"use client";

import { useEffect, useRef, useState } from "react";
import { GameWSProvider, useGameWS } from "../../game/GameWSContext";
import GameHUD from "../../game/GameHUD";
import { usePlayerMedia } from "../../game/usePlayerMedia";
import { GameErrorBoundary } from "../../game/GameErrorBoundary";
import { IntroSequence } from "../../game/IntroSequence";

/**
 * Judge Game Shell — /ls/judges/game
 *
 * Identical to /ls/game but sends judge_mode: true in the session_start event.
 * The backend uses this flag to adjust scoring/observation behaviour.
 *
 * Per TEAM_CONTRACT.md §3: session_start payload includes { judge_mode: boolean }
 *
 * Flow:
 *   1. Landing: shows "BEGIN JUDGE SESSION" (disabled until permissions silently checked).
 *   2a. If perms already granted → immediately show PLAY button.
 *   2b. If perms not yet granted → show GRANT PERMISSIONS onboarding → then PLAY button.
 *   3. PLAY click → connect() + start credits immediately (WS connects in background).
 */

function JudgeGameInner() {
  const [sessionPhase, setSessionPhase] = useState<
    "waiting" | "intro" | "active"
  >("waiting");
  // Sub-stage within the "waiting" phase
  const [stage, setStage] = useState<"landing" | "onboarding" | "play_ready">(
    "landing",
  );
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [grantingPerms, setGrantingPerms] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const sessionActive = sessionPhase !== "waiting";
  const { connect } = useGameWS();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const { webcamActive, micDenied, webcamDenied, cameraObscured, stopAll } =
    usePlayerMedia(sessionActive, audioCtxRef);

  // Silently check if mic + cam are already granted so BEGIN can branch correctly.
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
        // Graceful fallback for browsers with partial Permissions API support.
      } finally {
        if (!cancelled) setPermissionsChecked(true);
      }
    }

    checkMediaPermissions();
    return () => {
      cancelled = true;
    };
  }, []);

  // "BEGIN JUDGE SESSION" click: branch on whether perms are already granted.
  function handleBeginSession() {
    if (permissionsGranted) {
      setStage("play_ready");
    } else {
      setStage("onboarding");
    }
  }

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
      setStage("play_ready");
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.getTracks().forEach((t) => t.stop());
          // Webcam denied but mic allowed — continue (webcam is non-fatal for scoring).
          setPermissionsGranted(true);
          setStage("play_ready");
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

  // PLAY: connect WS in background, start credits immediately.
  function handlePlay() {
    connect();
    setSessionPhase("intro");
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
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

      {sessionPhase === "waiting" && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90"
          style={{
            fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
          }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase"
            style={{ color: "rgba(192,132,252,0.6)" }}
          >
            Liminal Sin — Judge Access — Session Ready
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: "0 0 30px rgba(255,0,50,0.4)" }}
          >
            ENTER
          </h1>
          <p className="text-sm text-purple-300/60 font-mono max-w-xs text-center leading-relaxed">
            Judge mode active. Microphone and camera access required.
          </p>

          {/* ── Stage: landing (before BEGIN is clicked) ───────────── */}
          {stage === "landing" && (
            <button
              onClick={handleBeginSession}
              disabled={!permissionsChecked}
              className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!permissionsChecked ? "Checking devices…" : "Begin Judge Session"}
            </button>
          )}

          {/* ── Stage: onboarding (perms not yet granted) ──────────── */}
          {stage === "onboarding" && (
            <>
              {permissionError && (
                <p
                  className="text-xs tracking-wider text-center max-w-xs"
                  style={{ color: "rgba(220,38,38,0.8)" }}
                >
                  {permissionError}
                </p>
              )}
              <button
                onClick={handleGrantPermissions}
                disabled={grantingPerms}
                className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {grantingPerms ? "Awaiting permissions…" : "Grant Permissions"}
              </button>
            </>
          )}

          {/* ── Stage: play_ready (perms confirmed) ────────────────── */}
          {stage === "play_ready" && (
            <button
              onClick={handlePlay}
              className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
            >
              PLAY
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function JudgeGamePage() {
  return (
    <GameErrorBoundary>
      <GameWSProvider judgeMode={true}>
        <JudgeGameInner />
      </GameWSProvider>
    </GameErrorBoundary>
  );
}
