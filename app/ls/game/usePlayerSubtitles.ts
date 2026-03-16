"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── Web Speech API types (not in TS DOM lib) ── */
interface SRResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: { readonly transcript: string; readonly confidence: number };
}
interface SRResultList {
  readonly length: number;
  readonly [index: number]: SRResult;
}
interface SREvent extends Event {
  readonly resultIndex: number;
  readonly results: SRResultList;
}
interface SRErrorEvent extends Event {
  readonly error: string;
}
interface SRInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((ev: SREvent) => void) | null;
  onerror: ((ev: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SRConstructor {
  new (): SRInstance;
}

function getSpeechRecognition(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as SRConstructor | null;
}

/**
 * usePlayerSubtitles — Live speech-to-text subtitles via the Web Speech API.
 *
 * Returns the current transcript string and a `visible` flag that fades out
 * ~2 s after the user stops speaking.  Completely browser-side — no backend.
 *
 * When `active` is false the recognition is torn down.
 */
export function usePlayerSubtitles(active: boolean) {
  const [transcript, setTranscript] = useState("");
  const [visible, setVisible] = useState(false);
  const recognitionRef = useRef<SRInstance | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const clearFadeTimer = useCallback(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const scheduleFade = useCallback(() => {
    clearFadeTimer();
    fadeTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, [clearFadeTimer]);

  useEffect(() => {
    const SR = getSpeechRecognition();

    if (!SR || !active) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* noop */ }
        recognitionRef.current = null;
      }
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (e: SREvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          // Show final briefly then schedule fade
          setTranscript(result[0].transcript.trim());
          setVisible(true);
          scheduleFade();
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) {
        setTranscript(interim.trim());
        setVisible(true);
        clearFadeTimer();
      }
    };

    recognition.onerror = (e: SRErrorEvent) => {
      // "no-speech" and "aborted" are expected — don't log those
      if (e.error !== "no-speech" && e.error !== "aborted") {
        console.warn("[subtitles] recognition error:", e.error);
      }
    };

    // Auto-restart when recognition ends (browsers stop after silence)
    recognition.onend = () => {
      if (!activeRef.current) return;
      // Small delay to avoid tight restart loops
      restartTimerRef.current = setTimeout(() => {
        if (!activeRef.current || !recognitionRef.current) return;
        try { recognitionRef.current.start(); } catch { /* already running */ }
      }, 300);
    };

    try { recognition.start(); } catch { /* may already be running */ }

    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      try { recognition.abort(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
  }, [active, scheduleFade, clearFadeTimer]);

  return { transcript, visible };
}
