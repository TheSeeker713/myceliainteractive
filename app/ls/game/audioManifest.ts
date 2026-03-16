/**
 * audioManifest.ts — Pure constants. No logic.
 *
 * Maps every audio key to one or more .mp3 paths (relative to /public).
 * Keys with multiple variants are picked randomly at runtime by useAudioLayers.
 * Music keys are pre-picked ONCE per session for uniqueness across players.
 */

const GCS = "https://storage.googleapis.com/liminal-sin-assets";
const M = `${GCS}/audio/music`;
const S = `${GCS}/audio/sfx`;

export const AUDIO_MANIFEST: Record<string, string[]> = {
  // ── Music (one variant pre-picked per session; loops) ──────────────────
  music_intro: [
    `${M}/music_intro.mp3`,
    `${M}/music_intro_2.mp3`,
    `${M}/music_intro_3.mp3`,
    `${M}/music_intro_4.mp3`,
    `${M}/music_intro_5.mp3`,
    `${M}/music_intro_6.mp3`,
  ],
  music_tension: [
    `${M}/music_tension.mp3`,
    `${M}/music_tension_2.mp3`,
    `${M}/music_tension_3.mp3`,
    `${M}/music_tension_4.mp3`,
    `${M}/music_tension_5.mp3`,
    `${M}/music_tension_6.mp3`,
  ],
  music_climax: [
    `${M}/music_climax.mp3`,
    `${M}/music_climax_2.mp3`,
    `${M}/music_climax_3.mp3`,
    `${M}/music_climax_4.mp3`,
  ],
  // Triggered by fourth_wall_correction — disembodied voices / low drone
  music_psychosis: [`${M}/music_psychosis.mp3`],

  // ── Ambient loops (session-locked variant; loops at low volume) ─────────
  // Loaded first in preloadAll so they are ready before session_ready fires.
  ambient_cold_open: [
    `${S}/cold_open_drip.mp3`,
    `${S}/cold_open_drip_2.mp3`,
    `${S}/cold_open_drip_3.mp3`,
    `${S}/cold_open_drip_4.mp3`,
    `${S}/sfx_drip_tunnel.mp3`,
    `${S}/sfx_drip_tunnel_2.mp3`,
    `${S}/sfx_drip_tunnel_3.mp3`,
    `${S}/sfx_drip_tunnel_4.mp3`,
  ],
  ambient_water_echo: [
    `${S}/sfx_water_echo.mp3`,
    `${S}/sfx_water_echo_2.mp3`,
    `${S}/sfx_water_echo_3.mp3`,
    `${S}/sfx_water_echo_4.mp3`,
  ],
  // Session-locked variant of rushing wind for intro cinematic
  wind_intro: [`${S}/rushing_wind.mp3`, `${S}/rushing_wind_2.mp3`],

  // ── SFX: Transmission / Session ─────────────────────────────────────────
  // Floor crack impact (pipeline Phase 2: fires once as final credit fades)
  floor_crack: [`${S}/floor_crack.mp3`],

  voicebox_activate: [
    `${S}/voicebox_activate.mp3`,
    `${S}/sfx_voicebox_activate.mp3`,
    `${S}/sfx_voicebox_activate_1.mp3`,
    `${S}/sfx_voicebox_activate_2.mp3`,
  ],
  // Used for BOTH transmission start ping AND barge-in (same pool, different context)
  transmission_ping: [
    `${S}/sfx_radio_static.mp3`,
    `${S}/sfx_radio_static_2.mp3`,
    `${S}/sfx_radio_static_3.mp3`,
    `${S}/sfx_radio_static_4.mp3`,
  ],
  barge_in: [
    `${S}/sfx_radio_static.mp3`,
    `${S}/sfx_radio_static_2.mp3`,
    `${S}/sfx_radio_static_3.mp3`,
    `${S}/sfx_radio_static_4.mp3`,
  ],

  // ── SFX: Clip cue environmental (pending GCS upload) ──────────────────
  footsteps_walk_loop: [`${S}/footsteps_walk_loop.mp3`],
  water_fountain: [`${S}/water_fountain.mp3`],

  // ── SFX: Trust / Fear ────────────────────────────────────────────────────
  knowledge_unlock: [
    `${S}/knowledge_unlock.mp3`,
    `${S}/knowledge_unlock_2.mp3`,
  ],
  trust_drop: [`${S}/sfx_trust_drop.mp3`],
  fear_spike: [
    `${S}/sfx_fear_spike.mp3`,
    `${S}/sfx_fear_spike_2.mp3`,
    `${S}/sfx_fear_spike_3.mp3`,
    `${S}/sfx_fear_spike_4.mp3`,
  ],
  fear_critical: [`${S}/fear_critical.mp3`],

  // ── SFX: Slotsky anomalies ───────────────────────────────────────────────
  slotsky_bells: [`${S}/slotsky_bells.mp3`, `${S}/sfx_slotsky.mp3`],
  slotsky_cards: [`${S}/slotsky_cards.mp3`],
  slotsky_lights: [`${S}/slotsky_lights.mp3`],
  slotsky_geometry: [
    `${S}/slotsky_geometry.mp3`,
    `${S}/slotsky_geometry_2.mp3`,
    `${S}/slotsky_geometry_3.mp3`,
    `${S}/slotsky_geometry_4.mp3`,
  ],
  // fourth_wall_correction fires bells first, then crackle 1.5 s later
  fourth_wall_bells: [`${S}/slotsky_bells.mp3`, `${S}/sfx_slotsky.mp3`],
  fourth_wall_crackle: [`${S}/fourth_wall_crackle.mp3`],

  // ── SFX: Glitch events ───────────────────────────────────────────────────
  glitch_low: [
    `${S}/glitch_low.mp3`,
    `${S}/sfx_glitch_low.mp3`,
    `${S}/sfx_glitch_low_2.mp3`,
    `${S}/sfx_glitch_low_3.mp3`,
    `${S}/sfx_glitch_low_4.mp3`,
  ],
  glitch_medium: [
    `${S}/glitch_medium.mp3`,
    `${S}/sfx_glitch_medium.mp3`,
    `${S}/sfx_glitch_medium_2.mp3`,
    `${S}/sfx_glitch_medium_3.mp3`,
    `${S}/sfx_glitch_medium_4.mp3`,
  ],
  glitch_high: [`${S}/glitch_high.mp3`, `${S}/sfx_glitch_high.mp3`],

  // ── SFX: Proximity / Session endings ────────────────────────────────────
  proximity_echo: [`${S}/proximity_echo.mp3`],
  proximity_found: [
    `${S}/proximity_found.mp3`,
    `${S}/proximity_found_2.mp3`,
    `${S}/proximity_found_3.mp3`,
  ],
  found_water_rise: [
    `${S}/found_water_rise.mp3`,
    `${S}/found_water_rise_2.mp3`,
    `${S}/found_water_rise_3.mp3`,
    `${S}/found_water_rise_4.mp3`,
  ],
  static_takeover: [`${S}/static_takeover.mp3`],
  descent_sting: [
    `${S}/descent_sting.mp3`,
    `${S}/descent_sting_2.mp3`,
    `${S}/descent_sting_3.mp3`,
    `${S}/descent_sting_4.mp3`,
  ],

  // ── SFX: Whisper / Relay ─────────────────────────────────────────────────
  jason_whisper: [`${S}/jason_whisper_mode.mp3`],
  relay_true: [`${S}/relay_true.mp3`, `${S}/relay_true_2.mp3`],
  relay_false: [`${S}/relay_false.mp3`],

  // ── SFX: Card + dread timer + endings ───────────────────────────────────
  // Audio files pending upload — preloader skips 404s gracefully.
  card_appear: [`${S}/card_appear.mp3`, `${S}/card_appear_2.mp3`],
  heartbeat_low: [`${S}/heartbeat_low.mp3`],
  heartbeat_mid: [`${S}/heartbeat_mid.mp3`],
  heartbeat_high1: [`${S}/heartbeat_high1.mp3`],
  heartbeat_high2: [`${S}/heartbeat_high2.mp3`],
  distant_growl1: [`${S}/distant_growl1.mp3`],
  distant_growl2: [`${S}/distant_growl2.mp3`],
  monster_sound1: [`${S}/monster_sound1.mp3`],
  monster_sound2: [`${S}/monster_sound2.mp3`],

  // Wildcard scare SFX — loud, close, in-ear burst
  scare_wildcard: [
    `${S}/sfx_fear_spike.mp3`,
    `${S}/sfx_fear_spike_2.mp3`,
    `${S}/sfx_fear_spike_3.mp3`,
    `${S}/sfx_fear_spike_4.mp3`,
    `${S}/fear_spike.mp3`,
  ],
};

export type MusicTier =
  | "music_intro"
  | "music_tension"
  | "music_climax"
  | "music_psychosis";

// Keys that are pre-picked once per session (music + ambient)
export const SESSION_LOCKED_KEYS: string[] = [
  "music_intro",
  "music_tension",
  "music_climax",
  "music_psychosis",
  "ambient_cold_open",
  "ambient_water_echo",
  "wind_intro",
];

// Loaded first in preloadAll so they are ready before first session_ready
export const PRIORITY_KEYS: string[] = [
  "ambient_cold_open",
  "ambient_water_echo",
];
