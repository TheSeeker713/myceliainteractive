"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import {
  normalizePointerInput,
  normalizeScrollInput,
} from "@/app/components/motion/atmosphere/inputState";
import { MYCELIA_FLOW_FRAGMENT_SHADER } from "@/app/components/motion/atmosphere/flowVideoShader";
import {
  detectMyceliaFlowDeviceCapability,
  selectMyceliaFlowMode,
  type MyceliaFlowCapability,
} from "@/app/components/motion/atmosphere/myceliaFlowMode";
import { computeVideoCamera } from "@/app/components/motion/atmosphere/videoCamera";
import {
  createWebGLAtmosphereRenderer,
  type WebGLAtmosphereRenderer,
} from "@/app/components/motion/atmosphere/webglRenderer";
import { subscribeAtmospherePointer } from "@/app/mobile/atmospherePointerBridge";
import "./liquid-glass.css";

export const FLOW_VIDEO_SRC = "/assets/atmosphere/mycelia-flow.mp4";
export const FLOW_POSTER_SRC = "/assets/atmosphere/mycelia-flow.jpg";
export const MYCELIA_FLOW_WHEEL_EVENT = "mycelia-flow-wheel";

const POINTER_VELOCITY_GAIN = 1.45;
const SCROLL_VELOCITY_GAIN = 1.55;

type MyceliaFlowAtmosphereProps = {
  reduceMotionOptIn: boolean;
  /** Soft-pause WebGL RAF + video; keeps FullVideoAtmosphere mounted. */
  pauseAtmosphere?: boolean;
  onError?: (error: Error) => void;
};

function PosterFallback({
  animated,
  className = "",
}: {
  animated: boolean;
  className?: string;
}) {
  return (
    <div
      className={`preview-flow-poster pointer-events-none${animated ? " preview-flow-poster--drift" : ""} ${className}`}
      style={{ backgroundImage: `url(${FLOW_POSTER_SRC})` }}
      aria-hidden="true"
    />
  );
}

async function ensureVideoPlaying(video: HTMLVideoElement): Promise<boolean> {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  try {
    await video.play();
    return !video.paused;
  } catch {
    return false;
  }
}

function FullVideoAtmosphere({
  onError,
  pauseAtmosphere = false,
}: {
  onError?: (error: Error) => void;
  pauseAtmosphere?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textureReadyRef = useRef(false);
  const rendererRef = useRef<WebGLAtmosphereRenderer | null>(null);
  const pauseAtmosphereRef = useRef(pauseAtmosphere);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let disposed = false;
    let renderer: WebGLAtmosphereRenderer | null = null;
    let failTimer: number | null = null;
    let virtualScrollY = 0;

    const fail = (error: Error) => {
      if (disposed) return;
      setFailed(true);
      onError?.(error);
    };

    const onVideoError = () => {
      fail(new Error("Mycelia flow video failed to load"));
    };

    const retryPlayIfNeeded = () => {
      if (disposed || !video.paused) return;
      void ensureVideoPlaying(video);
    };

    try {
      void ensureVideoPlaying(video).then((playing) => {
        if (disposed) return;
        if (!playing) {
          window.addEventListener("pointermove", retryPlayIfNeeded, {
            passive: true,
          });
          window.addEventListener("scroll", retryPlayIfNeeded, {
            passive: true,
          });
        }
      });

      renderer = createWebGLAtmosphereRenderer(canvas, {
        profile: "full",
        fragmentShader: MYCELIA_FLOW_FRAGMENT_SHADER,
        textureVideo: video,
        onTextureReady: () => {
          if (disposed) return;
          textureReadyRef.current = true;
          setReady(true);
        },
        onTextureError: (error) => fail(error),
        onContextLost: () =>
          fail(new Error("The WebGL atmosphere context was lost")),
      });

      let previousPointerX = window.innerWidth * 0.5;
      let previousPointerY = window.innerHeight * 0.5;
      let previousScrollY = 0;
      let latestPointerX = 0.5;
      let latestPointerY = 0.5;
      let latestScroll = 0;
      let latestScrollVelocity = 0;

      const pushCamera = () => {
        renderer?.setInput(
          computeVideoCamera({
            pointerX: latestPointerX,
            pointerY: latestPointerY,
            scroll: latestScroll,
            scrollVelocity: latestScrollVelocity,
          }),
        );
      };

      const pushScroll = (nextScrollY: number, scrollHeight: number) => {
        const input = normalizeScrollInput({
          scrollY: nextScrollY,
          previousScrollY,
          viewportHeight: window.innerHeight,
          scrollHeight,
        });
        previousScrollY = nextScrollY;
        latestScroll = input.scroll;
        latestScrollVelocity = input.scrollVelocity * SCROLL_VELOCITY_GAIN;
        renderer?.setInput({
          scroll: latestScroll,
          scrollVelocity: latestScrollVelocity,
        });
        pushCamera();
      };

      const updatePointer = (event: PointerEvent) => {
        retryPlayIfNeeded();
        applyPointerClient(event.clientX, event.clientY);
      };

      const applyPointerClient = (clientX: number, clientY: number) => {
        const input = normalizePointerInput({
          clientX,
          clientY,
          previousClientX: previousPointerX,
          previousClientY: previousPointerY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });
        previousPointerX = clientX;
        previousPointerY = clientY;
        latestPointerX = input.pointerX;
        latestPointerY = input.pointerY;
        renderer?.setInput({
          pointerX: input.pointerX,
          pointerY: input.pointerY,
          pointerVelocityX: input.pointerVelocityX * POINTER_VELOCITY_GAIN,
          pointerVelocityY: input.pointerVelocityY * POINTER_VELOCITY_GAIN,
        });
        pushCamera();
      };

      const onBridgePointer = (sample: { clientX: number; clientY: number }) => {
        retryPlayIfNeeded();
        applyPointerClient(sample.clientX, sample.clientY);
      };

      const onFlowWheel = (event: Event) => {
        const detail = (event as CustomEvent<{ deltaY: number }>).detail;
        if (!detail) return;
        retryPlayIfNeeded();
        virtualScrollY = Math.min(
          window.innerHeight * 7,
          Math.max(0, virtualScrollY + detail.deltaY),
        );
        pushScroll(virtualScrollY, window.innerHeight * 8);
        const pulse = Math.max(
          -2,
          Math.min(
            2,
            (detail.deltaY / Math.max(window.innerHeight, 1)) *
              3.2 *
              SCROLL_VELOCITY_GAIN,
          ),
        );
        latestScrollVelocity = pulse;
        renderer?.setInput({ scrollVelocity: pulse });
        pushCamera();
      };

      const onDocumentScroll = () => {
        retryPlayIfNeeded();
        pushScroll(
          window.scrollY,
          document.documentElement.scrollHeight,
        );
      };

      pushScroll(0, window.innerHeight * 8);
      pushCamera();
      window.addEventListener("pointermove", updatePointer, { passive: true });
      window.addEventListener("scroll", onDocumentScroll, { passive: true });
      window.addEventListener(MYCELIA_FLOW_WHEEL_EVENT, onFlowWheel);
      window.addEventListener("atmosphere-preview-wheel", onFlowWheel);
      const unsubscribeBridge = subscribeAtmospherePointer(onBridgePointer);
      video.addEventListener("error", onVideoError);
      rendererRef.current = renderer;
      renderer.start();
      // Honor current pause preference without remounting the renderer.
      renderer.setSuspended(pauseAtmosphereRef.current);
      if (pauseAtmosphereRef.current) {
        video.pause();
      }

      failTimer = window.setTimeout(() => {
        if (!disposed && !textureReadyRef.current) {
          fail(new Error("Mycelia flow video timed out"));
        }
      }, 8000);

      return () => {
        disposed = true;
        if (failTimer !== null) window.clearTimeout(failTimer);
        window.removeEventListener("pointermove", updatePointer);
        window.removeEventListener("scroll", onDocumentScroll);
        window.removeEventListener(MYCELIA_FLOW_WHEEL_EVENT, onFlowWheel);
        window.removeEventListener("atmosphere-preview-wheel", onFlowWheel);
        window.removeEventListener("pointermove", retryPlayIfNeeded);
        window.removeEventListener("scroll", retryPlayIfNeeded);
        unsubscribeBridge();
        video.removeEventListener("error", onVideoError);
        rendererRef.current = null;
        renderer?.dispose();
        video.pause();
      };
    } catch (cause) {
      fail(
        cause instanceof Error
          ? cause
          : new Error("The WebGL atmosphere failed to initialize"),
      );
    }
  }, [onError]);

  useEffect(() => {
    pauseAtmosphereRef.current = pauseAtmosphere;
    const renderer = rendererRef.current;
    const video = videoRef.current;
    if (!renderer || !video) return;

    // Soft-pause: stop RAF via setSuspended + pause decode; resume cleanly.
    renderer.setSuspended(pauseAtmosphere);
    if (pauseAtmosphere) {
      video.pause();
    } else {
      void ensureVideoPlaying(video);
    }
  }, [pauseAtmosphere]);

  if (failed) {
    return <PosterFallback animated={false} />;
  }

  return (
    <>
      {/* Video stays outside the visual wrapper so decode is never tied to
          the pointer-events:none / stacking context of the canvas layer. */}
      <video
        ref={videoRef}
        className="preview-flow-video-source"
        src={FLOW_VIDEO_SRC}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        poster={FLOW_POSTER_SRC}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-[var(--z-site-backdrop)]"
        aria-hidden="true"
      >
        <PosterFallback
          animated={false}
          className="preview-flow-poster--under"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 500ms ease",
          }}
        />
      </div>
    </>
  );
}

export function MyceliaFlowAtmosphere({
  reduceMotionOptIn,
  pauseAtmosphere = false,
  onError,
}: MyceliaFlowAtmosphereProps) {
  const [mounted, setMounted] = useState(false);
  const [deviceCapability, setDeviceCapability] = useState<
    Omit<MyceliaFlowCapability, "reduceMotionOptIn">
  >({ webgl2Available: false });

  useEffect(() => {
    startTransition(() => {
      setDeviceCapability(detectMyceliaFlowDeviceCapability());
      setMounted(true);
    });
  }, []);

  const mode = selectMyceliaFlowMode({
    reduceMotionOptIn,
    ...deviceCapability,
  });

  if (!mounted || mode === "static" || mode === "lite") {
    return (
      <PosterFallback
        animated={mounted && mode === "lite" && !pauseAtmosphere}
      />
    );
  }

  return (
    <FullVideoAtmosphere
      key="mycelia-flow-full"
      onError={onError}
      pauseAtmosphere={pauseAtmosphere}
    />
  );
}
