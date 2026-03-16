"use client";

import { useEffect } from "react";
import type {
  AcecardKeywordTimerStartEvent,
  AcecardRevealStartEvent,
  CardDiscoveredEvent,
  CardPickup02ReadyEvent,
  DreadTimerStartEvent,
  GameOverEvent,
  GoodEndingEvent,
  SlotskyTriggerEvent,
} from "./GameWSContext";
import type {
  HudEventRefs,
  UseGameHudEffectsArgs,
} from "./useGameHudEffectTypes";
import { GCS_BASE, MUTED_CLIP_IDS } from "./mediaManifest";

export function useGameHudScenarioEffects(
  args: UseGameHudEffectsArgs,
  refs: HudEventRefs,
) {
  const {
    lastEvent,
    stopMusic,
    stopAmbientLoop,
    playSFX,
    playSequence,
    crossfadeMusic,
    send,
    sceneVideoRef,
    pushImage,
    cardLabelTimerRef,
    setShowCard,
    setCurrentCardId,
    setCardLabelVisible,
    setDemoEnded,
    setEndMode,
    setEndOverlayVisible,
    setShowPlayAgain,
    onStopMedia,
  } = args;
  const { dreadTimeoutRefs, dreadIntervalRefs, clearDreadTimers } = refs;

  // ── Slotsky trigger routing ──────────────────────────────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "slotsky_trigger") return;
    const ev = lastEvent as SlotskyTriggerEvent;
    switch (ev.payload.anomalyType) {
      case "anomaly_bells":
        playSFX("slotsky_bells");
        break;
      case "anomaly_cards":
        // [AI: fixed BUG 2 — was triggering card overlay; now CSS VHS distortion only]
        playSFX("slotsky_cards");
        document.body.classList.add("slotsky-cards-vhs");
        setTimeout(() => document.body.classList.remove("slotsky-cards-vhs"), 500);
        break;
      case "anomaly_lights":
        playSFX("slotsky_lights");
        break;
      case "anomaly_geometry":
        playSFX("slotsky_geometry");
        break;
      case "fourth_wall_correction":
        playSequence([
          { key: "fourth_wall_bells", delayMs: 0 },
          { key: "fourth_wall_crackle", delayMs: 1500 },
        ]);
        crossfadeMusic("music_psychosis", 1000);
        break;
      case "found_transition":
        // [AI: fixed BUG 1 — was ending session prematurely; now cosmetic pulse only]
        playSFX("proximity_found");
        document.body.classList.add("slotsky-scan-pulse");
        setTimeout(() => document.body.classList.remove("slotsky-scan-pulse"), 800);
        break;
      // ── Wildcard slotsky types ──────────────────────────────────────────
      case "wildcard_vision_feed_start":
        playSFX("glitch_low", 0.7);
        document.body.classList.add("wildcard-hud-active");
        break;
      case "wildcard_vision_feed_end":
        playSFX("glitch_low", 0.7);
        document.body.classList.remove("wildcard-hud-active");
        break;
      case "wildcard_scare_sfx":
        playSFX("scare_wildcard", 1);
        break;
      case "wildcard_game_over_loading":
        playSFX("heartbeat_high1", 0.85);
        document.body.classList.add("wildcard2-loading");
        break;
      case "wildcard_game_over_start":
        document.body.classList.remove("wildcard2-loading");
        document.body.classList.add("wildcard2-active");
        playSFX("scare_wildcard", 1);
        break;
      case "wildcard_good_ending_loading":
        document.body.classList.add("wildcard3-loading");
        break;
      case "wildcard_good_ending_start":
        document.body.classList.remove("wildcard3-loading");
        document.body.classList.add("wildcard3-active");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  // ── Card discovered ──────────────────────────────────────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "card_discovered") return;
    const ev = lastEvent as CardDiscoveredEvent;
    playSFX("card_appear");
    setCurrentCardId(ev.cardId);
    setShowCard(true);
    setCardLabelVisible(false);
    if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
    cardLabelTimerRef.current = setTimeout(() => {
      setCardLabelVisible(true);
      cardLabelTimerRef.current = null;
    }, 2000);
  }, [
    cardLabelTimerRef,
    lastEvent,
    playSFX,
    setCardLabelVisible,
    setCurrentCardId,
    setShowCard,
  ]);

  // ── Dread timer start (90s heartbeat escalation) ─────────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "dread_timer_start") return;
    const ev = lastEvent as DreadTimerStartEvent;
    clearDreadTimers();

    const total = ev.durationMs > 0 ? ev.durationMs : 90000;
    const phase1 = setInterval(() => playSFX("heartbeat_low", 0.55), 1250);
    dreadIntervalRefs.current.push(phase1);

    const t30 = setTimeout(() => {
      clearInterval(phase1);
      const phase2 = setInterval(() => playSFX("heartbeat_mid", 0.7), 880);
      dreadIntervalRefs.current.push(phase2);
    }, 30000);
    dreadTimeoutRefs.current.push(t30);

    const t60 = setTimeout(() => {
      for (const id of dreadIntervalRefs.current) clearInterval(id);
      dreadIntervalRefs.current = [];
      const high = setInterval(() => {
        playSFX("heartbeat_high1", 0.85);
        playSFX("heartbeat_high2", 0.85);
      }, 760);
      const growl = setInterval(() => {
        playSFX("distant_growl1", 0.8);
        playSFX("distant_growl2", 0.8);
      }, 4800);
      dreadIntervalRefs.current.push(high, growl);
    }, 60000);
    dreadTimeoutRefs.current.push(t60);

    const tend = setTimeout(() => {
      clearDreadTimers();
    }, total);
    dreadTimeoutRefs.current.push(tend);
  }, [
    clearDreadTimers,
    dreadIntervalRefs,
    dreadTimeoutRefs,
    lastEvent,
    playSFX,
  ]);

  // ── Acecard keyword timer (30s heartbeat escalation) ─────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "acecard_keyword_timer_start") return;
    const ev = lastEvent as AcecardKeywordTimerStartEvent;
    clearDreadTimers();

    const total = ev.payload.durationMs > 0 ? ev.payload.durationMs : 30000;
    // Phase 1 (0-10s): low heartbeat
    const phase1 = setInterval(() => playSFX("heartbeat_low", 0.3), 1250);
    dreadIntervalRefs.current.push(phase1);

    // Phase 2 (10-20s): mid heartbeat
    const t10 = setTimeout(() => {
      clearInterval(phase1);
      const phase2 = setInterval(() => playSFX("heartbeat_mid", 0.5), 880);
      dreadIntervalRefs.current.push(phase2);
    }, 10000);
    dreadTimeoutRefs.current.push(t10);

    // Phase 3 (20-30s): high heartbeat + growls
    const t20 = setTimeout(() => {
      for (const id of dreadIntervalRefs.current) clearInterval(id);
      dreadIntervalRefs.current = [];
      const high = setInterval(() => {
        playSFX("heartbeat_high1", 0.8);
        playSFX("heartbeat_high2", 0.8);
      }, 760);
      dreadIntervalRefs.current.push(high);
      // Growls at ~22s and ~27s
      const growl1 = setTimeout(() => playSFX("distant_growl1", 0.8), 2000);
      const growl2 = setTimeout(() => playSFX("distant_growl2", 0.8), 7000);
      dreadTimeoutRefs.current.push(growl1, growl2);
    }, 20000);
    dreadTimeoutRefs.current.push(t20);

    const tend = setTimeout(() => clearDreadTimers(), total);
    dreadTimeoutRefs.current.push(tend);
  }, [
    clearDreadTimers,
    dreadIntervalRefs,
    dreadTimeoutRefs,
    lastEvent,
    playSFX,
  ]);

  // ── Acecard reveal start (play acecard clip, send complete) ──────────────
  useEffect(() => {
    if (lastEvent?.type !== "acecard_reveal_start") return;
    const ev = lastEvent as AcecardRevealStartEvent;
    clearDreadTimers(); // stop heartbeat SFX
    args.setShowPanelOverlay(false); // hide the clickable panel SVG

    const video = sceneVideoRef.current;
    if (!video) return;

    const clipUrl = `${GCS_BASE}/clips/${ev.payload.mediaId}.mp4`;
    video.src = clipUrl;
    video.style.display = "block";
    video.muted = MUTED_CLIP_IDS.has(ev.payload.mediaId);
    video.playbackRate = 1.0;
    video.play().catch((e) => {
      if ((e as DOMException).name === "AbortError") return; // Scene changed before playback began — safe to ignore
      console.error("[Acecard] clip play error:", e);
    });

    const onEnded = () => {
      video.removeEventListener("ended", onEnded);
      send({ type: "acecard_reveal_complete" });
    };
    video.addEventListener("ended", onEnded);
  }, [clearDreadTimers, lastEvent, sceneVideoRef, send]);

  // ── Card pickup 02 ready (show still + card2 overlay) ────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "card_pickup_02_ready") return;
    const ev = lastEvent as CardPickup02ReadyEvent;

    // Show the card_pickup_02 still from GCS
    const stillUrl = `${GCS_BASE}/stills/${ev.payload.mediaId}.png`;
    pushImage(stillUrl);

    // Show card2 overlay
    playSFX("card_appear");
    setCurrentCardId("card2");
    setShowCard(true);
    setCardLabelVisible(false);
    if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
    cardLabelTimerRef.current = setTimeout(() => {
      setCardLabelVisible(true);
      cardLabelTimerRef.current = null;
    }, 2000);

    // Resume urgent heartbeat for 15s window
    const high = setInterval(() => {
      playSFX("heartbeat_high1", 0.85);
      playSFX("heartbeat_high2", 0.85);
    }, 760);
    dreadIntervalRefs.current.push(high);
    const tend = setTimeout(() => {
      clearInterval(high);
    }, ev.payload.durationMs || 15000);
    dreadTimeoutRefs.current.push(tend);
  }, [
    cardLabelTimerRef,
    clearDreadTimers,
    dreadIntervalRefs,
    dreadTimeoutRefs,
    lastEvent,
    playSFX,
    pushImage,
    setCardLabelVisible,
    setCurrentCardId,
    setShowCard,
  ]);

  // ── Wildcard3 trigger (good ending CSS treatment) ────────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "wildcard3_trigger") return;
    document.body.classList.add("wildcard3-loading");
  }, [lastEvent]);

  // ── Game over ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "game_over") return;
    void (lastEvent as GameOverEvent);
    clearDreadTimers();
    // Clean up wildcard CSS classes
    document.body.classList.remove(
      "wildcard2-loading", "wildcard2-active",
      "wildcard3-loading", "wildcard3-active",
      "wildcard-hud-active",
    );
    stopMusic(500);
    stopAmbientLoop(500);
    playSFX("monster_sound1", 1);
    playSFX("monster_sound2", 1);
    setDemoEnded(true);
    setEndMode("game_over");
    setShowPlayAgain(false);
    setTimeout(() => {
      setEndOverlayVisible(true);
      setShowPlayAgain(true);
      onStopMedia?.();
    }, 1200);
  }, [
    clearDreadTimers,
    lastEvent,
    onStopMedia,
    playSFX,
    setDemoEnded,
    setEndMode,
    setEndOverlayVisible,
    setShowPlayAgain,
    stopAmbientLoop,
    stopMusic,
  ]);

  // ── Good ending ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (lastEvent?.type !== "good_ending") return;
    void (lastEvent as GoodEndingEvent);
    clearDreadTimers();
    // Clean up wildcard CSS classes
    document.body.classList.remove(
      "wildcard2-loading", "wildcard2-active",
      "wildcard3-loading", "wildcard3-active",
      "wildcard-hud-active",
    );
    stopMusic(500);
    stopAmbientLoop(500);
    setDemoEnded(true);
    setEndMode("good_ending");
    setEndOverlayVisible(true);
    setShowPlayAgain(false);
    const timer = setTimeout(() => setShowPlayAgain(true), 5000);
    dreadTimeoutRefs.current.push(timer);
    onStopMedia?.();
  }, [
    clearDreadTimers,
    dreadTimeoutRefs,
    lastEvent,
    onStopMedia,
    setDemoEnded,
    setEndMode,
    setEndOverlayVisible,
    setShowPlayAgain,
    stopAmbientLoop,
    stopMusic,
  ]);
}
