"use client";

import { useCallback, useEffect, useRef } from "react";

const SCRUB_SENSITIVITY = 0.0009;
const VELOCITY_DECAY = 0.9;
const LERP_FACTOR = 0.28;
const VELOCITY_EPSILON = 0.00005;
const IDLE_PAUSE_MS = 350;

function normalizeWheelDelta(e: WheelEvent): number {
  let delta = e.deltaY;
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= window.innerHeight;
  }
  return delta;
}

type UseVideoScrubEngineOptions = {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
};

export function useVideoScrubEngine({
  enabled,
  videoRef,
  ready,
}: UseVideoScrubEngineOptions) {
  const targetTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(false);

  const applyScrollDelta = useCallback((deltaY: number) => {
    if (!enabled || !ready) return;

    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    velocityRef.current += deltaY * SCRUB_SENSITIVITY;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      velocityRef.current = 0;
    }, IDLE_PAUSE_MS);
  }, [enabled, ready, videoRef]);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled || !ready) {
      stopLoop();
      return;
    }

    const video = videoRef.current;
    if (video) {
      targetTimeRef.current = video.currentTime;
      lastScrollYRef.current = window.scrollY;
    }

    isRunningRef.current = true;
    lastFrameRef.current = null;

    const scrubFrame = (timestamp: number) => {
      const currentVideo = videoRef.current;
      if (!currentVideo || !isRunningRef.current) return;

      const last = lastFrameRef.current ?? timestamp;
      const dt = Math.min((timestamp - last) / 1000, 0.05);
      lastFrameRef.current = timestamp;

      const duration = currentVideo.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        rafRef.current = requestAnimationFrame(scrubFrame);
        return;
      }

      let velocity = velocityRef.current;
      velocity *= VELOCITY_DECAY ** (dt * 60);
      velocityRef.current = velocity;

      if (Math.abs(velocity) > VELOCITY_EPSILON) {
        let nextTarget = targetTimeRef.current + velocity * dt * 60;
        nextTarget = Math.max(0, Math.min(duration - 0.02, nextTarget));
        targetTimeRef.current = nextTarget;
      }

      const current = currentVideo.currentTime;
      const target = targetTimeRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001 || Math.abs(velocity) > VELOCITY_EPSILON) {
        currentVideo.currentTime = current + diff * LERP_FACTOR;
        if (currentVideo.paused) {
          void currentVideo.play().catch(() => {});
        }
      } else if (!currentVideo.paused) {
        currentVideo.pause();
      }

      rafRef.current = requestAnimationFrame(scrubFrame);
    };

    rafRef.current = requestAnimationFrame(scrubFrame);

    const handleWheel = (e: WheelEvent) => {
      applyScrollDelta(normalizeWheelDelta(e));
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;
      if (deltaY !== 0) {
        applyScrollDelta(deltaY);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      stopLoop();
    };
  }, [enabled, ready, applyScrollDelta, stopLoop, videoRef]);
}
