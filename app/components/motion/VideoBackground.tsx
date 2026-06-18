"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useVideoScrubEngine } from "./useVideoScrubEngine";

const VIDEO_SRC = "/assets/video/mycelia_bg.mp4";
const POSTER_SRC = "/assets/images/Mycelia_Interactive_Logo.jpg";

type VideoBackgroundProps = {
  enabled?: boolean;
};

export function VideoBackground({ enabled = true }: VideoBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      video.pause();
      video.currentTime = 0;
      setReady(true);
    };

    const onError = () => {
      console.error("[VideoBackground] Failed to load mycelia_bg.mp4");
      setHasError(true);
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("error", onError);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      onReady();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };
  }, []);

  useVideoScrubEngine({
    enabled: enabled && !reducedMotion && ready && !hasError,
    videoRef,
    ready,
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
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        aria-hidden
      />
    </div>
  );
}
