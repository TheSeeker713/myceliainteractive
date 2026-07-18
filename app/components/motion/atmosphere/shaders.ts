export const FULLSCREEN_VERTEX_SHADER = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  vec2 position = vec2(
    float((gl_VertexID << 1) & 2),
    float(gl_VertexID & 2)
  );
  vUv = position;
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const DIAGNOSTIC_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uPointerVelocity;
uniform float uScroll;
uniform float uScrollVelocity;

void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  float pulse = 0.5 + 0.5 * sin(uTime * 0.5);
  vec3 warmNeutral = vec3(0.91, 0.95, 0.94);
  vec3 diagnosticTeal = vec3(0.18, 0.42, 0.49);
  vec3 color = mix(warmNeutral, diagnosticTeal, uv.x * (0.2 + pulse * 0.15));
  outColor = vec4(color, 1.0);
}
`;

/** Depth Drift — layered parallax treatment of the supplied arbor image. */
export const REFERENCE_DEPTH_FRAGMENT_SHADER = `#version 300 es
precision highp float;

out vec4 outColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uPointerVelocity;
uniform float uScroll;
uniform float uScrollVelocity;

vec2 coverUv(vec2 uv, float screenAspect, float imageAspect) {
  vec2 covered = uv;
  if (screenAspect > imageAspect) {
    covered.y = (uv.y - 0.5) * (imageAspect / screenAspect) + 0.5;
  } else {
    covered.x = (uv.x - 0.5) * (screenAspect / imageAspect) + 0.5;
  }
  return covered;
}

vec3 sampleImage(vec2 uv) {
  return texture(uTexture, clamp(uv, 0.001, 0.999)).rgb;
}

vec3 sampleSoft(vec2 uv, float radius) {
  vec3 sum = sampleImage(uv);
  sum += sampleImage(uv + vec2(radius, 0.0));
  sum += sampleImage(uv - vec2(radius, 0.0));
  sum += sampleImage(uv + vec2(0.0, radius));
  sum += sampleImage(uv - vec2(0.0, radius));
  return sum * 0.2;
}

vec3 sampleChromatic(vec2 uv, vec2 offset) {
  float r = sampleImage(uv + offset).r;
  float g = sampleImage(uv).g;
  float b = sampleImage(uv - offset).b;
  return vec3(r, g, b);
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 screenUv = gl_FragCoord.xy / resolution;
  float aspect = resolution.x / resolution.y;
  float imageAspect = max(uImageSize.x, 1.0) / max(uImageSize.y, 1.0);
  vec2 pointer = uPointer;
  vec2 toPointer = pointer - screenUv;
  float pointerDistance = length(toPointer * vec2(aspect, 1.0));
  float pointerField = exp(-pointerDistance * 3.8);
  float scrollEnergy = min(abs(uScrollVelocity) * 4.5, 1.0);

  vec2 uv = coverUv(screenUv, aspect, imageAspect);
  float zoom = 1.02 + uScroll * 0.11;
  uv = (uv - 0.5) / zoom + 0.5;
  uv += (pointer - 0.5) * 0.035;
  uv.y += (uScroll - 0.5) * 0.04;
  uv += uPointerVelocity * pointerField * 0.55;

  vec2 farUv = (uv - 0.5) * 0.94 + 0.5;
  vec2 nearUv = uv + toPointer * pointerField * 0.018;
  float lens = sin(pointerDistance * 28.0 - uTime * 2.4) * pointerField;
  nearUv += normalize(toPointer + 0.0001) * lens * 0.01;

  vec3 farLayer = sampleSoft(farUv, 0.0035);
  vec3 midLayer = sampleImage(uv);
  vec3 nearLayer = sampleChromatic(
    nearUv,
    normalize(toPointer + 0.001) * (0.0018 + length(uPointerVelocity) * 0.01)
  );

  float branchMask = smoothstep(
    0.12,
    0.48,
    max(midLayer.r, max(midLayer.g, midLayer.b)) -
      min(midLayer.r, min(midLayer.g, midLayer.b))
  );
  vec3 color = mix(farLayer, midLayer, 0.72);
  color = mix(color, nearLayer, 0.38 + branchMask * 0.28);
  color += vec3(0.35, 0.80, 1.0) * pointerField * 0.10;
  color *= 1.0 + scrollEnergy * 0.08;

  float vignette = smoothstep(
    1.12,
    0.18,
    length((screenUv - 0.5) * vec2(aspect * 0.78, 1.0))
  );
  color *= 0.90 + vignette * 0.10;
  outColor = vec4(color, 1.0);
}
`;
