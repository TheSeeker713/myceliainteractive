"use client";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

// ── Asset URLs ──────────────────────────────────────────
const SHEET_URLS = [
  "/assets/frames/spritesheet1.webp",
  "/assets/frames/spritesheet2.webp",
  "/assets/frames/spritesheet3.webp",
  "/assets/frames/spritesheet4.webp",
] as const;

const VIDEO_WEBM = "/assets/video/mycelia_bg.webm";
const VIDEO_MP4  = "/assets/video/mycelia_bg.mp4";
const POSTER_SRC = "/assets/images/Mycelia_Interactive_Logo.jpg";

// ── Spritesheet constants ────────────────────────────────
const FRAME_W         = 1280;
const FRAME_H         = 720;
const GRID_COLS       = 6;
const FRAMES_PER_SHEET = 48;
const TOTAL_FRAMES    = 192;
const SHEET_COUNT     = 4;

// ── Pure functions ───────────────────────────────────────
function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function getActualFrame(progress: number): number {
  return Math.round(clamp01(progress) * (TOTAL_FRAMES - 1));
}

function getDrawParams(frameIndex: number) {
  const sheetIndex  = Math.min(
    Math.floor(frameIndex / FRAMES_PER_SHEET),
    SHEET_COUNT - 1,
  );
  const localFrame  = frameIndex % FRAMES_PER_SHEET;
  const col         = localFrame % GRID_COLS;
  const row         = Math.floor(localFrame / GRID_COLS);
  return { sheetIndex, localFrame, col, row,
    sx: col * FRAME_W, sy: row * FRAME_H };
}

function shouldUseFallback(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as unknown as Record<string, unknown>;
  const conn = nav.connection as
    | { saveData?: boolean; effectiveType?: string }
    | undefined;
  if (conn?.saveData === true) return true;
  if (conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g") return true;
  if (typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 2) return true;
  const mem = nav.deviceMemory as number | undefined;
  if (mem !== undefined && mem <= 1) return true;
  return false;
}

// ── Component ────────────────────────────────────────────
type VideoBackgroundProps = { enabled?: boolean };

export function VideoBackground({ enabled = true }: VideoBackgroundProps) {
  const reducedMotion  = usePrefersReducedMotion();
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const imagesRef      = useRef<Array<HTMLImageElement | null>>(
    Array(SHEET_COUNT).fill(null),
  );
  const scrollProgressRef = useRef(0);
  const frameRef          = useRef(-1);
  const rafRef            = useRef<number | null>(null);

  const [useFallback] = useState(() => shouldUseFallback());

  const [ready,    setReady]    = useState(false);
  const [hasError, setHasError] = useState(false);

  // Effect 1 -- load spritesheets (skipped for fallback)
  useEffect(() => {
    if (!enabled || reducedMotion || useFallback) return;

    let cancelled = false;

    const img0 = new Image();
    img0.onload = () => {
      if (cancelled) return;
      imagesRef.current[0] = img0;
      setReady(true);

      // Defer remaining sheets
      const loadDeferred = (index: number) => {
        if (index >= SHEET_COUNT) return;
        const load = () => {
          if (cancelled) return;
          const img = new Image();
          img.onload = () => {
            imagesRef.current[index] = img;
            loadDeferred(index + 1);
          };
          img.onerror = () => {
            console.warn("[VideoBackground] Sheet", index,
              "failed -- continuing");
            loadDeferred(index + 1);
          };
          img.src = SHEET_URLS[index];
        };
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(load, { timeout: 3000 });
        } else {
          setTimeout(load, 500 * index);
        }
      };
      loadDeferred(1);
    };
    img0.onerror = () => { if (!cancelled) setHasError(true); };
    img0.src = SHEET_URLS[0];

    return () => {
      cancelled = true;
      img0.onload  = null;
      img0.onerror = null;
    };
  }, [enabled, reducedMotion, useFallback]);

  // Effect 2 -- canvas resize (self-guards via canvasRef)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => {
      const ctx = canvas.getContext("2d");
      const fi  = frameRef.current;
      if (!ready || !ctx || fi < 0) return;
      const d   = getDrawParams(fi);
      const img = imagesRef.current[d.sheetIndex];
      if (!img) return;
      ctx.drawImage(img, d.sx, d.sy, FRAME_W, FRAME_H,
        0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [ready]);

  // Effect 3 -- scroll listener + RAF render loop
  useEffect(() => {
    if (!ready || !enabled || reducedMotion || useFallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (fi: number): boolean => {
      const d   = getDrawParams(fi);
      const img = imagesRef.current[d.sheetIndex];
      if (!img) return false;
      ctx.drawImage(img, d.sx, d.sy, FRAME_W, FRAME_H,
        0, 0, canvas.width, canvas.height);
      return true;
    };

    const handleScroll = () => {
      const max = document.documentElement.scrollHeight
        - window.innerHeight;
      scrollProgressRef.current = max > 0
        ? window.scrollY / max : 0;
    };

    const render = () => {
      const f = getActualFrame(scrollProgressRef.current);
      if (f !== frameRef.current && drawFrame(f)) {
        frameRef.current = f;
      }
      rafRef.current = requestAnimationFrame(render);
    };

    handleScroll();
    const f0 = getActualFrame(scrollProgressRef.current);
    if (f0 !== frameRef.current && drawFrame(f0)) {
      frameRef.current = f0;
    }
    rafRef.current = requestAnimationFrame(render);
    window.addEventListener("scroll", handleScroll,
      { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [ready, enabled, reducedMotion, useFallback]);

  // ── Render ─────────────────────────────────────────────
  if (!enabled) return null;

  if (reducedMotion || hasError) {
    return (
      <div
        className="fixed inset-0 z-[var(--z-site-backdrop)]"
        style={{
          backgroundImage: `url(${POSTER_SRC})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
    );
  }

  if (useFallback) {
    return (
      <div className="fixed inset-0 z-[var(--z-site-backdrop)]" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO_MP4}  type="video/mp4"  />
        </video>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[var(--z-site-backdrop)]" aria-hidden="true">
      {!ready && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${POSTER_SRC})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 500ms ease",
        }}
      />
    </div>
  );
}
