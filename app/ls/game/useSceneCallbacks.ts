"use client";

import { useCallback, type MutableRefObject } from "react";

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
}) {
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
    if (!video || vhsSwapping) return;

    if (video.duration > 0 && video.currentTime >= video.duration - 0.05) {
      setVhsSwapping(true);
      if (vhsSwapTimerRef.current) clearTimeout(vhsSwapTimerRef.current);
      vhsSwapTimerRef.current = setTimeout(() => {
        setVhsSwapping(false);
        vhsSwapTimerRef.current = null;
      }, 300);
    }
  }, [sceneVideoRef, setVhsSwapping, vhsSwapTimerRef, vhsSwapping]);

  return {
    pushImage,
    handleSceneVideoEnded,
    handleVideoTimeUpdate,
  };
}
