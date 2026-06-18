"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ScrollStageState } from "./ScrollStageContext";

const SCRUB_SENSITIVITY = 0.0009;
const VELOCITY_DECAY = 0.9;
const LERP_FACTOR = 0.28;
const VELOCITY_EPSILON = 0.00005;
const IDLE_PAUSE_MS = 350;
const KEYFRAME_LERP = 0.12;

function normalizeWheelDelta(e: WheelEvent): number {
  let delta = e.deltaY;
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= window.innerHeight;
  }
  return delta;
}

function getSectionKeyframeTime(
  sectionIndex: number,
  sectionCount: number,
  duration: number,
): number {
  if (sectionCount <= 1) return 0;
  const ratio = sectionIndex / (sectionCount - 1);
  return Math.max(0, Math.min(duration - 0.02, duration * ratio));
}

type UseVideoScrubEngineOptions = {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
  scrollStage: ScrollStageState | null;
};

export function useVideoScrubEngine({
  enabled,
  videoRef,
  ready,
  scrollStage,
}: UseVideoScrubEngineOptions) {
  const targetTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(false);
  const scrollStageRef = useRef(scrollStage);

  useEffect(() => {
    scrollStageRef.current = scrollStage;
  }, [scrollStage]);

  const applyWheelDelta = useCallback((deltaY: number) => {
    const stage = scrollStageRef.current;
    if (!enabled || !ready) return;
    if (stage?.isTransitioning) return;

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

      const stage = scrollStageRef.current;

      if (stage?.isTransitioning) {
        velocityRef.current = 0;
        const keyframe = getSectionKeyframeTime(
          stage.sectionIndex,
          stage.sectionCount,
          duration,
        );
        targetTimeRef.current +=
          (keyframe - targetTimeRef.current) * KEYFRAME_LERP;
      } else {
        let velocity = velocityRef.current;
        velocity *= VELOCITY_DECAY ** (dt * 60);
        velocityRef.current = velocity;

        if (Math.abs(velocity) > VELOCITY_EPSILON) {
          let nextTarget = targetTimeRef.current + velocity * dt * 60;
          nextTarget = Math.max(0, Math.min(duration - 0.02, nextTarget));
          targetTimeRef.current = nextTarget;
        }
      }

      const current = currentVideo.currentTime;
      const target = targetTimeRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001 || Math.abs(velocityRef.current) > VELOCITY_EPSILON) {
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
      applyWheelDelta(normalizeWheelDelta(e));
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      stopLoop();
    };
  }, [enabled, ready, applyWheelDelta, stopLoop, videoRef]);
}
