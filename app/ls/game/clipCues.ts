/**
 * clipCues.ts — Per-clip timed event cues from LS_VIDEO_PIPELINE.md.
 *
 * Each clip has an array of cues fired at specific seconds during playback.
 * Actions: "sfx" | "glitch" | "css_class_add" | "css_class_remove" | "set_generator_lit"
 *
 * The handleVideoTimeUpdate in useSceneCallbacks checks currentTime and fires
 * each cue exactly once per clip playback.
 */

export type CueAction =
  | { type: "sfx"; key: string; volume?: number }
  | { type: "glitch"; intensity: "low" | "medium" | "high"; durationMs: number }
  | { type: "css_class_add"; className: string; durationMs?: number }
  | { type: "set_generator_lit" };

export type ClipCue = {
  /** Seconds into the clip when the cue fires. */
  timeS: number;
  action: CueAction;
};

/**
 * Map from mediaId → array of timed cues.
 * Only clips with timed events need entries.
 */
export const CLIP_CUES: Record<string, ClipCue[]> = {
  // Pipeline step 3: flashlight_sweep_01 (10s, muted)
  // Walking SFX plays during entire clip, ambient sounds play.
  flashlight_sweep_01: [
    { timeS: 0.5, action: { type: "sfx", key: "footsteps_walk_loop", volume: 0.4 } },
  ],

  // Pipeline step 4: tunnel_flashlight_01 (15s, no clip sound)
  // at 3s walking SFX, at 12s stop walking — handled by start cue only (loop stops on clip end).
  tunnel_flashlight_01: [
    { timeS: 3, action: { type: "sfx", key: "footsteps_walk_loop", volume: 0.4 } },
  ],

  // Pipeline step 5: tunnel_generator_01 (10s, no clip sound)
  // at 1.5s walking SFX starts.
  tunnel_generator_01: [
    { timeS: 1.5, action: { type: "sfx", key: "footsteps_walk_loop", volume: 0.4 } },
  ],

  // Pipeline step 7: card_joker_01 (15s, no clip sound)
  // at 9s flashlight CSS overlay permanently removed.
  card_joker_01: [
    { timeS: 9, action: { type: "set_generator_lit" } },
  ],

  // Pipeline step 12: park_reveal_01 (15s, has sound)
  // at 9s full-screen CSS glitch and noise for 1s.
  park_reveal_01: [
    { timeS: 9, action: { type: "glitch", intensity: "high", durationMs: 1000 } },
    { timeS: 9, action: { type: "sfx", key: "glitch_high", volume: 0.8 } },
  ],

  // Pipeline step 14: park_walkway_02 (15s, no clip sound)
  // water fountain SFX, walking on wet concrete SFX.
  park_walkway_02: [
    { timeS: 1, action: { type: "sfx", key: "water_fountain", volume: 0.3 } },
    { timeS: 1, action: { type: "sfx", key: "footsteps_walk_loop", volume: 0.35 } },
  ],

  // Pipeline step 21: elevator_inside_02 (15s, has sound)
  // at 4s a 2s full-screen CSS glitch and noise.
  elevator_inside_02: [
    { timeS: 4, action: { type: "glitch", intensity: "high", durationMs: 2000 } },
    { timeS: 4, action: { type: "sfx", key: "glitch_high", volume: 0.9 } },
  ],
};
