"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useScrollStage } from "./ScrollStageContext";
import { useVideoScrubEngine } from "./useVideoScrubEngine";

const VIDEO_MP4 = "/assets/video/mycelia_bg.mp4";
const VIDEO_WEBM = "/assets/video/mycelia_bg.webm";
const POSTER_SRC = "/assets/images/Mycelia_Interactive_Logo.jpg";

type VideoBackgroundProps = {
  enabled?: boolean;
};

export function VideoBackground({ enabled = true }: VideoBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();
  const scrollStage = useScrollStage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const startPreload = () => setShouldPreload(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(startPreload, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = setTimeout(startPreload, 1200);
    return () => clearTimeout(timer);
  }, [enabled, reducedMotion]);

  useEffect(() => {
    if (!shouldPreload) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.networkState !== HTMLMediaElement.NETWORK_EMPTY) {
      return;
    }

    video.load();
  }, [shouldPreload]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      video.pause();
      video.currentTime = 0;
      setReady(true);
      setVideoVisible(true);
    };

    const onError = () => {
      console.error("[VideoBackground] Failed to load background video");
      setHasError(true);
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      onCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, []);

  useVideoScrubEngine({
    enabled: enabled && !reducedMotion && ready && !hasError,
    videoRef,
    ready,
    scrollStage,
  });

  if (!enabled) return null;

  if (reducedMotion || hasError) {
    return (
      <div
        className="fixed inset-0 z-[-10] pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${POSTER_SRC})` }}
        aria-hidden
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden bg-[#fafaf8]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: `url(${POSTER_SRC})`,
          opacity: videoVisible ? 0 : 1,
        }}
        aria-hidden
      />
      <video
        ref={videoRef}
        poster={POSTER_SRC}
        muted
        playsInline
        preload={shouldPreload ? "auto" : "metadata"}
        className="h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: videoVisible ? 1 : 0 }}
        aria-hidden
      >
        <source src={VIDEO_WEBM} type="video/webm" />
        <source src={VIDEO_MP4} type="video/mp4" />
      </video>
    </div>
  );
}
