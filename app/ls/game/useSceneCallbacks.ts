"use client";

import { useCallback, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import { CLIP_CUES } from "./clipCues";

/**
 * useSceneCallbacks
 *
 * Extracts scene media callback logic from GameHUD so the container file can stay
 * focused on orchestration and event handling.
 */
export function useSceneCallbacks({
  activeImgLayerRef,
  setImgLayerA,
  setImgLayerB,
  setActiveImgLayer,
  sceneVideoRef,
  canvasRef,
  clearSceneVideo,
  vhsSwapping,
  setVhsSwapping,
  vhsSwapTimerRef,
  playSFX,
  setGlitchClass,
  glitchTimerRef,
  setGeneratorLit,
  setGeneratorAmber,
  setGeneratorFlickering,
  generatorFlickerTimerRef,
}: {
  activeImgLayerRef: MutableRefObject<0 | 1>;
  setImgLayerA: React.Dispatch<React.SetStateAction<string | null>>;
  setImgLayerB: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveImgLayer: React.Dispatch<React.SetStateAction<0 | 1>>;
  sceneVideoRef: MutableRefObject<HTMLVideoElement | null>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  clearSceneVideo: () => void;
  vhsSwapping: boolean;
  setVhsSwapping: React.Dispatch<React.SetStateAction<boolean>>;
  vhsSwapTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  playSFX: (key: string, volumeScale?: number) => void;
  setGlitchClass: Dispatch<SetStateAction<string | null>>;
  glitchTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setGeneratorLit: Dispatch<SetStateAction<boolean>>;
  setGeneratorAmber: Dispatch<SetStateAction<boolean>>;
  setGeneratorFlickering: Dispatch<SetStateAction<boolean>>;
  generatorFlickerTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
}) {
  // Track which cues have already fired for the current clip playback.
  const firedCuesRef = useRef<Set<number>>(new Set());
  // Track current playing mediaId so cues know which clip is active.
  const currentMediaIdRef = useRef<string | null>(null);
  const pushImage = useCallback(
    (dataUri: string) => {
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
    },
    [activeImgLayerRef, setActiveImgLayer, setImgLayerA, setImgLayerB],
  );

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
          "[GameHUD] Canvas tainted - video stays frozen on last frame",
        );
      }
    }

    if (captured && video) video.style.display = "none";
    clearSceneVideo();
  }, [canvasRef, clearSceneVideo, pushImage, sceneVideoRef]);

  const handleVideoTimeUpdate = useCallback(() => {
    const video = sceneVideoRef.current;
    if (!video) return;

    // ── Timed clip cues ────────────────────────────────────────────────────
    const mediaId = currentMediaIdRef.current;
    if (mediaId) {
      const cues = CLIP_CUES[mediaId];
      if (cues) {
        const t = video.currentTime;
        for (let i = 0; i < cues.length; i++) {
          if (firedCuesRef.current.has(i)) continue;
          if (t >= cues[i].timeS) {
            firedCuesRef.current.add(i);
            const action = cues[i].action;
            switch (action.type) {
              case "sfx":
                playSFX(action.key, action.volume);
                break;
              case "glitch": {
                const cls =
                  action.intensity === "low"
                    ? "hud-glitch-active-low"
                    : action.intensity === "high"
                      ? "hud-glitch-active-high"
                      : "hud-glitch-active-medium";
                if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
                setGlitchClass(cls);
                glitchTimerRef.current = setTimeout(() => {
                  setGlitchClass(null);
                  glitchTimerRef.current = null;
                }, action.durationMs);
                break;
              }
              case "css_class_add":
                document.body.classList.add(action.className);
                if (action.durationMs) {
                  setTimeout(
                    () => document.body.classList.remove(action.className),
                    action.durationMs,
                  );
                }
                break;
              case "set_generator_lit":
                setGeneratorLit(true);
                setGeneratorAmber(true);
                setGeneratorFlickering(false);
                if (generatorFlickerTimerRef.current) {
                  clearTimeout(generatorFlickerTimerRef.current);
                  generatorFlickerTimerRef.current = null;
                }
                break;
            }
          }
        }
      }
    }

    // ── VHS swap at video end ──────────────────────────────────────────────
    if (!vhsSwapping && video.duration > 0 && video.currentTime >= video.duration - 0.05) {
      setVhsSwapping(true);
      if (vhsSwapTimerRef.current) clearTimeout(vhsSwapTimerRef.current);
      vhsSwapTimerRef.current = setTimeout(() => {
        setVhsSwapping(false);
        vhsSwapTimerRef.current = null;
      }, 300);
    }
  }, [generatorFlickerTimerRef, glitchTimerRef, playSFX, sceneVideoRef, setGeneratorAmber, setGeneratorFlickering, setGeneratorLit, setGlitchClass, setVhsSwapping, vhsSwapTimerRef, vhsSwapping]);

  /** Called by scene_change handler when a new clip starts playing. */
  const setCurrentMediaId = useCallback((mediaId: string | null) => {
    currentMediaIdRef.current = mediaId;
    firedCuesRef.current.clear();
  }, []);

  return {
    pushImage,
    handleSceneVideoEnded,
    handleVideoTimeUpdate,
    setCurrentMediaId,
  };
}
