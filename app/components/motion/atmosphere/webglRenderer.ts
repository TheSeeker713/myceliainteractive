import {
  DIAGNOSTIC_FRAGMENT_SHADER,
  FULLSCREEN_VERTEX_SHADER,
} from "./shaders";

export type WebGLAtmosphereProfile = "full" | "lite";

export type AtmosphereInputState = {
  pointerX: number;
  pointerY: number;
  pointerVelocityX: number;
  pointerVelocityY: number;
  scroll: number;
  scrollVelocity: number;
  /** Optional footage-camera UV offset (shader may ignore if unused). */
  cameraOffsetX: number;
  cameraOffsetY: number;
  /** Optional footage-camera zoom; 1 = identity. */
  cameraZoom: number;
};

export type CanvasBackingSize = {
  width: number;
  height: number;
  pixelRatio: number;
};

export type WebGLAtmosphereRendererOptions = {
  profile: WebGLAtmosphereProfile;
  fragmentShader?: string;
  textureUrl?: string;
  /** When set, frames are uploaded from this video each render via texSubImage2D. */
  textureVideo?: HTMLVideoElement;
  onReady?: () => void;
  onTextureReady?: () => void;
  onTextureError?: (error: Error) => void;
  onContextLost?: () => void;
  onContextRestored?: () => void;
};

export type WebGLAtmosphereRenderer = {
  start: () => void;
  stop: () => void;
  /** Soft-pause: blocks RAF start (incl. visibility resume) until cleared. */
  setSuspended: (suspended: boolean) => void;
  resize: () => void;
  setInput: (input: Partial<AtmosphereInputState>) => void;
  dispose: () => void;
};

type ProfileSettings = {
  maxPixelRatio: number;
  frameIntervalMs: number;
  powerPreference: WebGLPowerPreference;
};

const PROFILE_SETTINGS: Record<WebGLAtmosphereProfile, ProfileSettings> = {
  full: {
    maxPixelRatio: 1.5,
    frameIntervalMs: 1000 / 60,
    powerPreference: "high-performance",
  },
  lite: {
    maxPixelRatio: 1,
    frameIntervalMs: 1000 / 30,
    powerPreference: "low-power",
  },
};

export class WebGLAtmosphereRendererError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebGLAtmosphereRendererError";
  }
}

export function getCanvasBackingSize(
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
  maxPixelRatio: number,
): CanvasBackingSize {
  const pixelRatio = Math.max(
    1,
    Math.min(
      Number.isFinite(devicePixelRatio) ? devicePixelRatio : 1,
      maxPixelRatio,
    ),
  );

  return {
    width: Math.max(1, Math.round(cssWidth * pixelRatio)),
    height: Math.max(1, Math.round(cssHeight * pixelRatio)),
    pixelRatio,
  };
}

export function shouldRenderFrame(
  timestamp: number,
  lastTimestamp: number,
  frameIntervalMs: number,
): boolean {
  return lastTimestamp === 0 || timestamp - lastTimestamp >= frameIntervalMs;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new WebGLAtmosphereRendererError("Unable to allocate shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const diagnostic =
      gl.getShaderInfoLog(shader) ?? "No shader diagnostic was provided";
    gl.deleteShader(shader);
    throw new WebGLAtmosphereRendererError(
      `Atmosphere shader compilation failed: ${diagnostic}`,
    );
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  fragmentShaderSource: string,
): WebGLProgram {
  const vertexShader = compileShader(
    gl,
    gl.VERTEX_SHADER,
    FULLSCREEN_VERTEX_SHADER,
  );
  let fragmentShader: WebGLShader | null = null;

  try {
    fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    const program = gl.createProgram();
    if (!program) {
      throw new WebGLAtmosphereRendererError(
        "Unable to allocate shader program",
      );
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const diagnostic =
        gl.getProgramInfoLog(program) ?? "No link diagnostic was provided";
      gl.deleteProgram(program);
      throw new WebGLAtmosphereRendererError(
        `Atmosphere shader link failed: ${diagnostic}`,
      );
    }

    return program;
  } finally {
    gl.deleteShader(vertexShader);
    if (fragmentShader) {
      gl.deleteShader(fragmentShader);
    }
  }
}

export function createWebGLAtmosphereRenderer(
  canvas: HTMLCanvasElement,
  {
    profile,
    fragmentShader = DIAGNOSTIC_FRAGMENT_SHADER,
    textureUrl,
    textureVideo,
    onReady,
    onTextureReady,
    onTextureError,
    onContextLost,
    onContextRestored,
  }: WebGLAtmosphereRendererOptions,
): WebGLAtmosphereRenderer {
  const settings = PROFILE_SETTINGS[profile];
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: settings.powerPreference,
  });

  if (!gl) {
    throw new WebGLAtmosphereRendererError("WebGL2 is unavailable");
  }

  const program = createProgram(gl, fragmentShader);
  const vertexArray = gl.createVertexArray();
  if (!vertexArray) {
    gl.deleteProgram(program);
    throw new WebGLAtmosphereRendererError(
      "Unable to allocate vertex array",
    );
  }

  const resolutionLocation = gl.getUniformLocation(program, "uResolution");
  const timeLocation = gl.getUniformLocation(program, "uTime");
  const pointerLocation = gl.getUniformLocation(program, "uPointer");
  const pointerVelocityLocation = gl.getUniformLocation(
    program,
    "uPointerVelocity",
  );
  const scrollLocation = gl.getUniformLocation(program, "uScroll");
  const scrollVelocityLocation = gl.getUniformLocation(
    program,
    "uScrollVelocity",
  );
  const cameraOffsetLocation = gl.getUniformLocation(program, "uCameraOffset");
  const cameraZoomLocation = gl.getUniformLocation(program, "uCameraZoom");
  const textureLocation = gl.getUniformLocation(program, "uTexture");
  const imageSizeLocation = gl.getUniformLocation(program, "uImageSize");
  const texture = gl.createTexture();
  if (!texture) {
    gl.deleteVertexArray(vertexArray);
    gl.deleteProgram(program);
    throw new WebGLAtmosphereRendererError("Unable to allocate texture");
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([247, 244, 236, 255]),
  );

  let imageWidth = 16;
  let imageHeight = 9;
  let videoTextureAllocated = false;
  let textureReadyNotified = false;
  const textureImage = !textureVideo && textureUrl ? new Image() : null;
  if (textureImage && textureUrl) {
    textureImage.onload = () => {
      if (disposed) return;
      imageWidth = Math.max(textureImage.naturalWidth, 1);
      imageHeight = Math.max(textureImage.naturalHeight, 1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureImage,
      );
      if (!textureReadyNotified) {
        textureReadyNotified = true;
        onTextureReady?.();
      }
    };
    textureImage.onerror = () => {
      onTextureError?.(
        new WebGLAtmosphereRendererError(
          `Unable to load atmosphere texture: ${textureUrl}`,
        ),
      );
    };
    textureImage.src = textureUrl;
  }

  const uploadVideoFrame = () => {
    if (!textureVideo || disposed) return false;
    if (textureVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return false;
    }
    const nextWidth = textureVideo.videoWidth;
    const nextHeight = textureVideo.videoHeight;
    if (nextWidth < 2 || nextHeight < 2) return false;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    if (
      !videoTextureAllocated ||
      imageWidth !== nextWidth ||
      imageHeight !== nextHeight
    ) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureVideo,
      );
      videoTextureAllocated = true;
      imageWidth = nextWidth;
      imageHeight = nextHeight;
    } else {
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureVideo,
      );
    }

    if (!textureReadyNotified) {
      textureReadyNotified = true;
      onTextureReady?.();
    }
    return true;
  };

  const startedAt = performance.now();
  let animationFrame: number | null = null;
  let lastRenderedAt = 0;
  let running = false;
  let disposed = false;
  let readyNotified = false;
  const targetInput: AtmosphereInputState = {
    pointerX: 0.5,
    pointerY: 0.5,
    pointerVelocityX: 0,
    pointerVelocityY: 0,
    scroll: 0,
    scrollVelocity: 0,
    cameraOffsetX: 0,
    cameraOffsetY: 0,
    cameraZoom: 1,
  };
  const currentInput = { ...targetInput };

  const setInput = (input: Partial<AtmosphereInputState>) => {
    Object.assign(targetInput, input);
  };

  const resize = () => {
    if (disposed) return;
    const bounds = canvas.getBoundingClientRect();
    const size = getCanvasBackingSize(
      bounds.width || window.innerWidth,
      bounds.height || window.innerHeight,
      window.devicePixelRatio,
      settings.maxPixelRatio,
    );

    if (canvas.width !== size.width || canvas.height !== size.height) {
      canvas.width = size.width;
      canvas.height = size.height;
      gl.viewport(0, 0, size.width, size.height);
    }
  };

  const render = (timestamp: number) => {
    if (!running || disposed) return;

    if (
      shouldRenderFrame(
        timestamp,
        lastRenderedAt,
        settings.frameIntervalMs,
      )
    ) {
      resize();
      gl.useProgram(program);
      gl.bindVertexArray(vertexArray);
      const smoothing = profile === "full" ? 0.085 : 0.14;
      currentInput.pointerX +=
        (targetInput.pointerX - currentInput.pointerX) * smoothing;
      currentInput.pointerY +=
        (targetInput.pointerY - currentInput.pointerY) * smoothing;
      currentInput.pointerVelocityX +=
        (targetInput.pointerVelocityX - currentInput.pointerVelocityX) * 0.16;
      currentInput.pointerVelocityY +=
        (targetInput.pointerVelocityY - currentInput.pointerVelocityY) * 0.16;
      currentInput.scroll +=
        (targetInput.scroll - currentInput.scroll) * smoothing;
      currentInput.scrollVelocity +=
        (targetInput.scrollVelocity - currentInput.scrollVelocity) * 0.16;
      // Camera eases slower than warp input so footage nudges feel heavy/organic.
      const cameraSmoothing = profile === "full" ? 0.045 : 0.07;
      currentInput.cameraOffsetX +=
        (targetInput.cameraOffsetX - currentInput.cameraOffsetX) *
        cameraSmoothing;
      currentInput.cameraOffsetY +=
        (targetInput.cameraOffsetY - currentInput.cameraOffsetY) *
        cameraSmoothing;
      currentInput.cameraZoom +=
        (targetInput.cameraZoom - currentInput.cameraZoom) * cameraSmoothing;
      targetInput.pointerVelocityX *= 0.88;
      targetInput.pointerVelocityY *= 0.88;
      targetInput.scrollVelocity *= 0.86;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (timestamp - startedAt) / 1000);
      gl.uniform2f(
        pointerLocation,
        currentInput.pointerX,
        currentInput.pointerY,
      );
      gl.uniform2f(
        pointerVelocityLocation,
        currentInput.pointerVelocityX,
        currentInput.pointerVelocityY,
      );
      gl.uniform1f(scrollLocation, currentInput.scroll);
      gl.uniform1f(scrollVelocityLocation, currentInput.scrollVelocity);
      if (cameraOffsetLocation) {
        gl.uniform2f(
          cameraOffsetLocation,
          currentInput.cameraOffsetX,
          currentInput.cameraOffsetY,
        );
      }
      if (cameraZoomLocation) {
        gl.uniform1f(cameraZoomLocation, currentInput.cameraZoom);
      }
      if (textureVideo) {
        uploadVideoFrame();
      }
      gl.uniform2f(imageSizeLocation, imageWidth, imageHeight);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textureLocation, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      lastRenderedAt = timestamp;
      if (!readyNotified) {
        readyNotified = true;
        onReady?.();
      }
    }

    animationFrame = requestAnimationFrame(render);
  };

  let suspended = false;

  const start = () => {
    if (disposed || running || document.hidden || suspended) return;
    running = true;
    lastRenderedAt = 0;
    resize();
    animationFrame = requestAnimationFrame(render);
  };

  const stop = () => {
    running = false;
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  const setSuspended = (next: boolean) => {
    suspended = next;
    if (next) {
      stop();
    } else {
      start();
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  };

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    onContextLost?.();
  };

  const handleContextRestored = () => {
    onContextRestored?.();
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);

  return {
    start,
    stop,
    setSuspended,
    resize,
    setInput,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
      );
      gl.bindVertexArray(null);
      if (textureImage) {
        textureImage.onload = null;
        textureImage.onerror = null;
        textureImage.src = "";
      }
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    },
  };
}
