"use client";

import { useEffect } from "react";
import type {
  CardDiscoveredEvent,
  DreadTimerStartEvent,
  GameOverEvent,
  GoodEndingEvent,
  SlotskyTriggerEvent,
} from "./GameWSContext";
import type {
  HudEventRefs,
  UseGameHudEffectsArgs,
} from "./useGameHudEffectTypes";

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
    wsCloseTimerRef,
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

  useEffect(() => {
    if (lastEvent?.type !== "slotsky_trigger") return;
    const ev = lastEvent as SlotskyTriggerEvent;
    switch (ev.payload.anomalyType) {
      case "anomaly_bells":
        playSFX("slotsky_bells");
        break;
      case "anomaly_cards":
        playSFX("slotsky_cards");
        setShowCard(true);
        setCurrentCardId("card2");
        setCardLabelVisible(false);
        if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
        cardLabelTimerRef.current = setTimeout(() => {
          setCardLabelVisible(true);
          cardLabelTimerRef.current = null;
        }, 2000);
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
        clearDreadTimers();
        stopMusic(500);
        stopAmbientLoop(500);
        playSFX("proximity_found");
        setDemoEnded(true);
        setEndMode("complete");
        setShowPlayAgain(false);
        setTimeout(() => setEndOverlayVisible(true), 2000);
        wsCloseTimerRef.current = setTimeout(() => {
          send({ type: "session_end" });
        }, 7000);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

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

  useEffect(() => {
    if (lastEvent?.type !== "game_over") return;
    void (lastEvent as GameOverEvent);
    clearDreadTimers();
    stopMusic(500);
    stopAmbientLoop(500);
    playSFX("monster_sound1", 1);
    playSFX("monster_sound2", 1);
    setDemoEnded(true);
    setEndMode("game_over");
    setShowPlayAgain(false);
    setTimeout(() => {
      setEndOverlayVisible(true);
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

  useEffect(() => {
    if (lastEvent?.type !== "good_ending") return;
    void (lastEvent as GoodEndingEvent);
    clearDreadTimers();
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
