/**
 * audioManifest.ts — Pure constants. No logic.
 *
 * Maps every audio key to one or more .mp3 paths (relative to /public).
 * Keys with multiple variants are picked randomly at runtime by useAudioLayers.
 * Music keys are pre-picked ONCE per session for uniqueness across players.
 */

export const AUDIO_MANIFEST: Record<string, string[]> = {
  // ── Music (one variant pre-picked per session; loops) ──────────────────
  music_intro: [
    "/assets/music/music_intro.mp3",
    "/assets/music/music_intro_2.mp3",
    "/assets/music/music_intro_3.mp3",
    "/assets/music/music_intro_4.mp3",
    "/assets/music/music_intro_5.mp3",
    "/assets/music/music_intro_6.mp3",
  ],
  music_tension: [
    "/assets/music/music_tension.mp3",
    "/assets/music/music_tension_2.mp3",
    "/assets/music/music_tension_3.mp3",
    "/assets/music/music_tension_4.mp3",
    "/assets/music/music_tension_5.mp3",
    "/assets/music/music_tension_6.mp3",
  ],
  music_climax: [
    "/assets/music/music_climax.mp3",
    "/assets/music/music_climax_2.mp3",
    "/assets/music/music_climax_3.mp3",
    "/assets/music/music_climax_4.mp3",
  ],
  // Triggered by fourth_wall_correction — disembodied voices / low drone
  music_psychosis: ["/assets/music/music_psychosis.mp3"],

  // ── Ambient loops (session-locked variant; loops at low volume) ─────────
  // Loaded first in preloadAll so they are ready before session_ready fires.
  ambient_cold_open: [
    "/assets/sound_fx/cold_open_drip.mp3",
    "/assets/sound_fx/cold_open_drip_2.mp3",
    "/assets/sound_fx/cold_open_drip_3.mp3",
    "/assets/sound_fx/cold_open_drip_4.mp3",
    "/assets/sound_fx/sfx_drip_tunnel.mp3",
    "/assets/sound_fx/sfx_drip_tunnel_2.mp3",
    "/assets/sound_fx/sfx_drip_tunnel_3.mp3",
    "/assets/sound_fx/sfx_drip_tunnel_4.mp3",
  ],
  ambient_water_echo: [
    "/assets/sound_fx/sfx_water_echo.mp3",
    "/assets/sound_fx/sfx_water_echo_2.mp3",
    "/assets/sound_fx/sfx_water_echo_3.mp3",
    "/assets/sound_fx/sfx_water_echo_4.mp3",
  ],

  // ── SFX: Transmission / Session ─────────────────────────────────────────
  voicebox_activate: [
    "/assets/sound_fx/voicebox_activate.mp3",
    "/assets/sound_fx/sfx_voicebox_activate.mp3",
    "/assets/sound_fx/sfx_voicebox_activate_1.mp3",
    "/assets/sound_fx/sfx_voicebox_activate_2.mp3",
  ],
  // Used for BOTH transmission start ping AND barge-in (same pool, different context)
  transmission_ping: [
    "/assets/sound_fx/sfx_radio_static.mp3",
    "/assets/sound_fx/sfx_radio_static_2.mp3",
    "/assets/sound_fx/sfx_radio_static_3.mp3",
    "/assets/sound_fx/sfx_radio_static_4.mp3",
  ],
  barge_in: [
    "/assets/sound_fx/sfx_radio_static.mp3",
    "/assets/sound_fx/sfx_radio_static_2.mp3",
    "/assets/sound_fx/sfx_radio_static_3.mp3",
    "/assets/sound_fx/sfx_radio_static_4.mp3",
  ],

  // ── SFX: Trust / Fear ────────────────────────────────────────────────────
  knowledge_unlock: [
    "/assets/sound_fx/knowledge_unlock.mp3",
    "/assets/sound_fx/knowledge_unlock_2.mp3",
  ],
  trust_drop: ["/assets/sound_fx/sfx_trust_drop.mp3"],
  fear_spike: [
    "/assets/sound_fx/sfx_fear_spike.mp3",
    "/assets/sound_fx/sfx_fear_spike_2.mp3",
    "/assets/sound_fx/sfx_fear_spike_3.mp3",
    "/assets/sound_fx/sfx_fear_spike_4.mp3",
  ],
  fear_critical: ["/assets/sound_fx/fear_critical.mp3"],

  // ── SFX: Slotsky anomalies ───────────────────────────────────────────────
  slotsky_bells: [
    "/assets/sound_fx/slotsky_bells.mp3",
    "/assets/sound_fx/sfx_slotsky.mp3",
  ],
  slotsky_cards: ["/assets/sound_fx/slotsky_cards.mp3"],
  slotsky_lights: ["/assets/sound_fx/slotsky_lights.mp3"],
  slotsky_geometry: [
    "/assets/sound_fx/slotsky_geometry.mp3",
    "/assets/sound_fx/slotsky_geometry_2.mp3",
    "/assets/sound_fx/slotsky_geometry_3.mp3",
    "/assets/sound_fx/slotsky_geometry_4.mp3",
  ],
  // fourth_wall_correction fires bells first, then crackle 1.5 s later
  fourth_wall_bells: [
    "/assets/sound_fx/slotsky_bells.mp3",
    "/assets/sound_fx/sfx_slotsky.mp3",
  ],
  fourth_wall_crackle: ["/assets/sound_fx/fourth_wall_crackle.mp3"],

  // ── SFX: Glitch events ───────────────────────────────────────────────────
  glitch_low: [
    "/assets/sound_fx/glitch_low.mp3",
    "/assets/sound_fx/sfx_glitch_low.mp3",
    "/assets/sound_fx/sfx_glitch_low_2.mp3",
    "/assets/sound_fx/sfx_glitch_low_3.mp3",
    "/assets/sound_fx/sfx_glitch_low_4.mp3",
  ],
  glitch_medium: [
    "/assets/sound_fx/glitch_medium.mp3",
    "/assets/sound_fx/sfx_glitch_medium.mp3",
    "/assets/sound_fx/sfx_glitch_medium_2.mp3",
    "/assets/sound_fx/sfx_glitch_medium_3.mp3",
    "/assets/sound_fx/sfx_glitch_medium_4.mp3",
  ],
  glitch_high: [
    "/assets/sound_fx/glitch_high.mp3",
    "/assets/sound_fx/sfx_glitch_high.mp3",
  ],

  // ── SFX: Proximity / Session endings ────────────────────────────────────
  proximity_echo: ["/assets/sound_fx/proximity_echo.mp3"],
  proximity_found: [
    "/assets/sound_fx/proximity_found.mp3",
    "/assets/sound_fx/proximity_found_2.mp3",
    "/assets/sound_fx/proximity_found_3.mp3",
  ],
  found_water_rise: [
    "/assets/sound_fx/found_water_rise.mp3",
    "/assets/sound_fx/found_water_rise_2.mp3",
    "/assets/sound_fx/found_water_rise_3.mp3",
    "/assets/sound_fx/found_water_rise_4.mp3",
  ],
  static_takeover: ["/assets/sound_fx/static_takeover.mp3"],
  descent_sting: [
    "/assets/sound_fx/descent_sting.mp3",
    "/assets/sound_fx/descent_sting_2.mp3",
    "/assets/sound_fx/descent_sting_3.mp3",
    "/assets/sound_fx/descent_sting_4.mp3",
  ],

  // ── SFX: Whisper / Relay ─────────────────────────────────────────────────
  jason_whisper: ["/assets/sound_fx/jason_whisper_mode.mp3"],
  relay_true: [
    "/assets/sound_fx/relay_true.mp3",
    "/assets/sound_fx/relay_true_2.mp3",
  ],
  relay_false: ["/assets/sound_fx/relay_false.mp3"],
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
];

// Loaded first in preloadAll so they are ready before first session_ready
export const PRIORITY_KEYS: string[] = ["ambient_cold_open", "ambient_water_echo"];
