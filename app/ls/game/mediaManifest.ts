/**
 * mediaManifest.ts — Morphic media constants for GCS-hosted stills & clips.
 *
 * All 16 canonical stills and 18 canonical clips are pre-built Morphic files
 * hosted on GCS bucket `liminal-sin-assets`. The frontend loads them by mediaId.
 *
 * Cross-reference: SHOT_STEPS.md (Scene Key Registry), FRONTEND_PLAN.txt §9
 */

/** GCS base URL for all Morphic media (stills + clips). */
export const GCS_BASE = "https://storage.googleapis.com/liminal-sin-assets";

/**
 * Set of all canonical Morphic media IDs.
 * Used to distinguish scripted GCS media from wildcard live-generated media.
 * If a mediaId is in this set → load from GCS.
 * If NOT in this set → treat as wildcard (base64 data from scene_image/scene_video).
 */
export const MORPHIC_MEDIA_IDS = new Set([
  "tunnel_darkness_01",
  "tunnel_flashlight_01",
  "tunnel_generator_01",
  "card_joker_01",
  "card_pickup_01",
  "card_pickup_02",
  "tunnel_transition_01",
  "park_reveal_01",
  "park_walkway_01",
  "park_walkway_02",
  "park_liminal_01",
  "shaft_maintenance_01",
  "maintenance_reveal_01",
  "elevator_entry_01",
  "elevator_inside_01",
  "elevator_inside_02",
  "hallway_pov_01",
  "hallway_pov_02",
  "acecard_reveal_01",
]);

/**
 * Media IDs that have a corresponding .mp4 clip on GCS.
 * Some IDs only have stills (no clip). This set tracks which have clips.
 */
export const MORPHIC_CLIP_IDS = new Set([
  "tunnel_darkness_01",
  "tunnel_flashlight_01",
  "tunnel_generator_01",
  "card_joker_01",
  "card_pickup_01",
  "card_pickup_02",
  "tunnel_transition_01",
  "park_reveal_01",
  "park_walkway_01",
  "park_walkway_02",
  "park_liminal_01",
  "shaft_maintenance_01",
  "maintenance_reveal_01",
  "elevator_entry_01",
  "elevator_inside_01",
  "elevator_inside_02",
  "hallway_pov_01",
  "hallway_pov_02",
]);

/** Build the GCS URL for a Morphic still by mediaId. */
export function getStillUrl(mediaId: string): string {
  return `${GCS_BASE}/stills/${mediaId}.png`;
}

/** Build the GCS URL for a Morphic clip by mediaId. */
export function getClipUrl(mediaId: string): string {
  return `${GCS_BASE}/clips/${mediaId}.mp4`;
}

/** First 3 stills to preload on page load for instant first-frame display. */
export const PRELOAD_STILLS: string[] = [
  "tunnel_darkness_01",
  "tunnel_flashlight_01",
  "tunnel_generator_01",
];
