/** Mycelia Flow — video-texture grade + organic warp for atmosphere-preview. */
export const MYCELIA_FLOW_FRAGMENT_SHADER = `#version 300 es
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
/** Footage-space camera nudge — applied before the approved warp stack. */
uniform vec2 uCameraOffset;
uniform float uCameraZoom;

vec2 coverUv(vec2 uv, float screenAspect, float imageAspect) {
  vec2 covered = uv;
  if (screenAspect > imageAspect) {
    covered.y = (uv.y - 0.5) * (imageAspect / screenAspect) + 0.5;
  } else {
    covered.x = (uv.x - 0.5) * (screenAspect / imageAspect) + 0.5;
  }
  return covered;
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 flowField(vec2 uv, float time, float energy) {
  float n1 = noise(uv * 2.4 + vec2(time * 0.07, -time * 0.05));
  float n2 = noise(uv * 3.8 + vec2(-time * 0.09, time * 0.06));
  vec2 flow = vec2(n1 - 0.5, n2 - 0.5);
  return flow * (0.018 + energy * 0.03);
}

vec3 sampleVideo(vec2 uv) {
  return texture(uTexture, clamp(uv, 0.001, 0.999)).rgb;
}

vec3 sampleSoft(vec2 uv, float radius) {
  vec3 sum = sampleVideo(uv);
  sum += sampleVideo(uv + vec2(radius, 0.0));
  sum += sampleVideo(uv - vec2(radius, 0.0));
  sum += sampleVideo(uv + vec2(0.0, radius));
  sum += sampleVideo(uv - vec2(0.0, radius));
  return sum * 0.2;
}

vec3 gradeTealAmber(vec3 color) {
  vec3 teal = vec3(0.10, 0.42, 0.48);
  vec3 amber = vec3(0.86, 0.58, 0.22);
  vec3 deep = vec3(0.03, 0.07, 0.09);
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 shadowed = mix(deep, color * vec3(0.55, 0.95, 1.05), smoothstep(0.05, 0.45, luma));
  vec3 mid = mix(shadowed, mix(teal, color, 0.55), smoothstep(0.2, 0.7, luma));
  vec3 lifted = mix(mid, mix(color, amber, 0.35), smoothstep(0.55, 0.95, luma));
  return lifted;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 screenUv = gl_FragCoord.xy / resolution;
  float aspect = resolution.x / resolution.y;
  float imageAspect = max(uImageSize.x, 1.0) / max(uImageSize.y, 1.0);
  vec2 pointer = uPointer;
  vec2 toPointer = pointer - screenUv;
  float pointerDistance = length(toPointer * vec2(aspect, 1.0));
  // Wider/softer pointer field so moderate mouse travel still reads.
  float pointerField = exp(-pointerDistance * 2.55);
  float scrollEnergy = min(abs(uScrollVelocity) * 6.4, 1.0);
  float pointerEnergy = min(length(uPointerVelocity) * 5.0, 1.0);
  float energy = clamp(scrollEnergy * 0.75 + pointerEnergy * 0.9, 0.0, 1.0);

  vec2 uv = coverUv(screenUv, aspect, imageAspect);

  // Camera layer: slow pan/zoom of the sampled footage itself.
  // Kept separate from the liquid warp block below (approved as-is).
  float cameraZoom = max(uCameraZoom, 0.85);
  uv = (uv - 0.5) / cameraZoom + 0.5;
  uv += uCameraOffset;

  float zoom = 1.04 + uScroll * 0.12;
  uv = (uv - 0.5) / zoom + 0.5;
  uv += (pointer - 0.5) * 0.048;
  uv.y += (uScroll - 0.5) * 0.05;
  uv += flowField(uv, uTime, energy);
  uv += uPointerVelocity * pointerField * 0.78;
  uv += normalize(toPointer + 0.0001) * sin(pointerDistance * 22.0 - uTime * 2.1) * pointerField * 0.02;

  vec2 chroma = normalize(toPointer + 0.001) * (0.002 + energy * 0.006);
  float r = sampleVideo(uv + chroma).r;
  float g = sampleVideo(uv).g;
  float b = sampleVideo(uv - chroma).b;
  vec3 color = vec3(r, g, b);
  vec3 bloom = sampleSoft(uv, 0.004 + energy * 0.0035);
  float glowMask = smoothstep(0.35, 0.9, dot(bloom, vec3(0.3, 0.55, 0.35)));
  color = mix(color, bloom, 0.22 + glowMask * 0.28);
  color = gradeTealAmber(color);
  color += vec3(0.18, 0.72, 0.78) * pointerField * (0.14 + energy * 0.08);
  color += vec3(0.9, 0.55, 0.18) * glowMask * (0.06 + scrollEnergy * 0.08);
  color *= 1.0 + energy * 0.1;

  float vignette = smoothstep(
    1.15,
    0.2,
    length((screenUv - 0.5) * vec2(aspect * 0.8, 1.0))
  );
  color *= 0.88 + vignette * 0.12;
  outColor = vec4(color, 1.0);
}
`;
