"use client";

import { useEffect, useRef, useState } from "react";
import {
  normalizePointerInput,
  normalizeScrollInput,
} from "./atmosphere/inputState";
import { REFERENCE_DEPTH_FRAGMENT_SHADER } from "./atmosphere/shaders";
import {
  createWebGLAtmosphereRenderer,
  type WebGLAtmosphereProfile,
} from "./atmosphere/webglRenderer";

const POSTER_SRC = "/assets/images/Mycelia_Interactive_Logo.jpg";
const REFERENCE_SRC = "/assets/images/atmosphere-arbor-reference.png";

type WebGLAtmosphereProps = {
  profile?: WebGLAtmosphereProfile;
  onError?: (error: Error) => void;
};

export function WebGLAtmosphere({
  profile = "full",
  onError,
}: WebGLAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const renderer = createWebGLAtmosphereRenderer(canvas, {
        profile,
        fragmentShader: REFERENCE_DEPTH_FRAGMENT_SHADER,
        textureUrl: REFERENCE_SRC,
        onTextureReady: () => setReady(true),
        onTextureError: (error) => {
          setFailed(true);
          onError?.(error);
        },
        onContextLost: () => {
          const error = new Error("The WebGL atmosphere context was lost");
          setFailed(true);
          onError?.(error);
        },
      });

      let previousPointerX = window.innerWidth * 0.5;
      let previousPointerY = window.innerHeight * 0.5;
      let previousScrollY = window.scrollY;

      const updateScroll = () => {
        const input = normalizeScrollInput({
          scrollY: window.scrollY,
          previousScrollY,
          viewportHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight,
        });
        previousScrollY = window.scrollY;
        renderer.setInput(input);
      };

      const updatePointer = (event: PointerEvent) => {
        const input = normalizePointerInput({
          clientX: event.clientX,
          clientY: event.clientY,
          previousClientX: previousPointerX,
          previousClientY: previousPointerY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });
        previousPointerX = event.clientX;
        previousPointerY = event.clientY;
        renderer.setInput(input);
      };

      updateScroll();
      window.addEventListener("scroll", updateScroll, { passive: true });
      window.addEventListener("pointermove", updatePointer, { passive: true });
      renderer.start();

      return () => {
        window.removeEventListener("scroll", updateScroll);
        window.removeEventListener("pointermove", updatePointer);
        renderer.dispose();
      };
    } catch (cause) {
      const error =
        cause instanceof Error
          ? cause
          : new Error("The WebGL atmosphere failed to initialize");
      const failureTimer = window.setTimeout(() => {
        setFailed(true);
        onError?.(error);
      }, 0);
      return () => window.clearTimeout(failureTimer);
    }
  }, [onError, profile]);

  if (failed) {
    return (
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${POSTER_SRC})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="fixed inset-0" aria-hidden="true">
      <div
        className="absolute inset-0 bg-[#f7f4ec]"
        style={{ opacity: ready ? 0 : 1 }}
      />
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
