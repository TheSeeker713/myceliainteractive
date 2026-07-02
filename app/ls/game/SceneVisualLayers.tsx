"use client";

import type { MutableRefObject } from "react";

export function SceneVisualLayers({
  glitchClass,
  generatorLit,
  generatorAmber,
  generatorFlickering,
  imgLayerA,
  imgLayerB,
  activeImgLayer,
  sceneVideoRef,
  canvasRef,
  vhsSwapping,
  handleSceneVideoEnded,
  handleVideoTimeUpdate,
  fmvRef,
}: {
  glitchClass: string | null;
  generatorLit: boolean;
  generatorAmber: boolean;
  generatorFlickering: boolean;
  imgLayerA: string | null;
  imgLayerB: string | null;
  activeImgLayer: 0 | 1;
  sceneVideoRef: MutableRefObject<HTMLVideoElement | null>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  vhsSwapping: boolean;
  handleSceneVideoEnded: () => void;
  handleVideoTimeUpdate: () => void;
  fmvRef: MutableRefObject<HTMLVideoElement | null>;
}) {
  return (
    <>
      <div
        className={[
          "scene-container",
          generatorLit ? "generator-lit" : "",
          generatorAmber ? "generator-amber" : "",
          generatorFlickering ? "generator-flicker-anim" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {imgLayerA && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgLayerA}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-[var(--z-game-base)] transition-opacity duration-1000"
            style={{ opacity: activeImgLayer === 0 ? 1 : 0 }}
          />
        )}
        {imgLayerB && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgLayerB}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-[var(--z-game-base)] transition-opacity duration-1000"
            style={{ opacity: activeImgLayer === 1 ? 1 : 0 }}
          />
        )}
      </div>

      <video
        ref={sceneVideoRef}
        crossOrigin="anonymous"
        className={[
          "absolute inset-0 w-full h-full object-cover z-[var(--z-game-scene-layer)]",
          vhsSwapping ? "vhs-swap" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ display: "none" }}
        playsInline
        onEnded={handleSceneVideoEnded}
        onTimeUpdate={handleVideoTimeUpdate}
      />
      <canvas ref={canvasRef} className="hidden" />

      <video
        ref={fmvRef}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover z-[var(--z-game-vignette)]"
        style={{ display: "none" }}
        playsInline
        muted={false}
      />

      {glitchClass === "hud-glitch-active-high" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[var(--z-game-scanline)] hud-glitch-scanlines"
          style={{ backgroundColor: "rgba(255, 0, 0, 0.06)" }}
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[var(--z-game-noise)] opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        }}
      />
    </>
  );
}
