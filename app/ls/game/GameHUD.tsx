"use client";

import { useCallback, useRef, useState, type MutableRefObject } from "react";
import { useGameWS } from "./GameWSContext";
import { useAudioLayers } from "./useAudioLayers";
import { useGameError } from "./useGameError";
import { useAgentAudio } from "./useAgentAudio";
import { useSceneCallbacks } from "./useSceneCallbacks";
import { TrustMeter } from "./TrustMeter";
import { CardCollectibleOverlay } from "./CardCollectibleOverlay";
import { DemoEndOverlay } from "./DemoEndOverlay";
import { GMEyeIndicator } from "./GMEyeIndicator";
import { StatusNotices } from "./StatusNotices";
import { HintOverlays } from "./HintOverlays";
import { SceneVisualLayers } from "./SceneVisualLayers";
import { useGameHudEffects } from "./useGameHudEffects";
import { useTrustAudioEffects } from "./useTrustAudioEffects";
import { ErrorOverlay, ErrorModal } from "./ErrorOverlay";

export default function GameHUD({
  sessionActive = false,
  audioCtxRef,
  webcamActive = false,
  micDenied = false,
  webcamDenied = false,
  cameraObscured = false,
  onStopMedia,
}: {
  sessionActive?: boolean;
  audioCtxRef: MutableRefObject<AudioContext | null>;
  webcamActive?: boolean;
  micDenied?: boolean;
  webcamDenied?: boolean;
  cameraObscured?: boolean;
  onStopMedia?: () => void;
}) {
  const { lastEvent, sceneChangeEvent, status, sceneImage, sceneVideo, clearSceneVideo, send } =
    useGameWS();
  const fmvRef = useRef<HTMLVideoElement>(null);
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [glitchClass, setGlitchClass] = useState<string | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [demoEnded, setDemoEnded] = useState(false);
  const [endOverlayVisible, setEndOverlayVisible] = useState(false);
  const wsCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [imgLayerA, setImgLayerA] = useState<string | null>(null);
  const [imgLayerB, setImgLayerB] = useState<string | null>(null);
  const [activeImgLayer, setActiveImgLayer] = useState<0 | 1>(0);
  const activeImgLayerRef = useRef<0 | 1>(0);
  const prevSceneImageRef = useRef<string | null>(null);
  const [generatorLit, setGeneratorLit] = useState(false);
  const [generatorAmber, setGeneratorAmber] = useState(false);
  const [generatorFlickering, setGeneratorFlickering] = useState(false);
  const generatorFlickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [vhsSwapping, setVhsSwapping] = useState(false);
  const vhsSwapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<"card1" | "card2">(
    "card2",
  );
  const [cardLabelVisible, setCardLabelVisible] = useState(false);
  const [cardCollecting, setCardCollecting] = useState(false);
  const cardLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [trustMeterActive, setTrustMeterActive] = useState(false);
  const [trustLevel, setTrustLevel] = useState(0.5);
  const [fearIndex, setFearIndex] = useState(0.3);
  const [trustAgentLabel, setTrustAgentLabel] = useState("jason");

  const [endMode, setEndMode] = useState<
    "complete" | "game_over" | "good_ending"
  >("complete");
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [serverHint, setServerHint] = useState<string | null>(null);
  const serverHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    ensureGainNodes,
    preloadAll,
    playSFX,
    crossfadeMusic,
    stopMusic,
    startAmbientLoop,
    stopAmbientLoop,
    playSequence,
  } = useAudioLayers(audioCtxRef);

  const { errorQueue, dispatchError, dismissError } = useGameError();
  const [cameraObscuredVisible, setCameraObscuredVisible] = useState(false);
  const cameraObscuredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [webcamDeniedVisible, setWebcamDeniedVisible] = useState(false);
  const webcamDeniedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useAgentAudio({
    audioCtxRef,
    lastEvent,
    playSFX,
    crossfadeMusic,
    dispatchError,
  });

  const { pushImage, handleSceneVideoEnded, handleVideoTimeUpdate } =
    useSceneCallbacks({
      activeImgLayerRef,
      setImgLayerA,
      setImgLayerB,
      setActiveImgLayer,
      sceneVideoRef,
      canvasRef,
      clearSceneVideo,
      vhsSwapping,
      setVhsSwapping,
      vhsSwapTimerRef,
    });

  useTrustAudioEffects({
    lastEvent,
    playSFX,
    crossfadeMusic,
  });

  useGameHudEffects({
    lastEvent,
    sceneChangeEvent,
    status,
    sceneImage,
    sceneVideo,
    sessionActive,
    demoEnded,
    cameraObscured,
    webcamDenied,
    micDenied,
    audioCtxRef,
    fmvRef,
    sceneVideoRef,
    ensureGainNodes,
    preloadAll,
    playSFX,
    crossfadeMusic,
    stopMusic,
    startAmbientLoop,
    stopAmbientLoop,
    playSequence,
    dispatchError,
    send,
    pushImage,
    setGeneratorFlickering,
    setGeneratorLit,
    setGeneratorAmber,
    generatorFlickerTimerRef,
    setServerHint,
    serverHintTimerRef,
    setGlitchClass,
    glitchTimerRef,
    setShowHint,
    hintTimerRef,
    setCameraObscuredVisible,
    cameraObscuredTimerRef,
    setWebcamDeniedVisible,
    webcamDeniedTimerRef,
    prevSceneImageRef,
    setShowCard,
    setCurrentCardId,
    setCardLabelVisible,
    cardLabelTimerRef,
    setDemoEnded,
    setEndMode,
    setEndOverlayVisible,
    setShowPlayAgain,
    setTrustMeterActive,
    setTrustLevel,
    setFearIndex,
    setTrustAgentLabel,
    onStopMedia,
    wsCloseTimerRef,
  });
  // [AI: removed dead handleEndSession that sent session_end — backend ignores it]
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleCollectCard = useCallback(() => {
    if (cardCollecting) return;
    setCardCollecting(true);
    if (cardLabelTimerRef.current) clearTimeout(cardLabelTimerRef.current);
    setTimeout(() => setShowCard(false), 500);
    send({ type: "card_collected", cardId: currentCardId });
  }, [cardCollecting, currentCardId, send]);

  return (
    <div
      className={`absolute inset-0${glitchClass ? ` ${glitchClass}` : ""}`}
      style={
        glitchClass
          ? {
              animation:
                glitchClass === "hud-glitch-active-low"
                  ? "hud-glitch-low 0.5s ease-in-out infinite"
                  : glitchClass === "hud-glitch-active-medium"
                    ? "hud-glitch-medium 0.7s ease-in-out infinite"
                    : "hud-glitch-high 0.9s ease-in-out infinite",
            }
          : undefined
      }
    >
      <SceneVisualLayers
        glitchClass={glitchClass}
        generatorLit={generatorLit}
        generatorAmber={generatorAmber}
        generatorFlickering={generatorFlickering}
        imgLayerA={imgLayerA}
        imgLayerB={imgLayerB}
        activeImgLayer={activeImgLayer}
        sceneVideoRef={sceneVideoRef}
        canvasRef={canvasRef}
        vhsSwapping={vhsSwapping}
        handleSceneVideoEnded={handleSceneVideoEnded}
        handleVideoTimeUpdate={handleVideoTimeUpdate}
        fmvRef={fmvRef}
      />

      <HintOverlays showHint={showHint} serverHint={serverHint} />
      <GMEyeIndicator
        visible={
          sessionActive && status === "open" && webcamActive && !demoEnded
        }
      />
      <TrustMeter
        active={trustMeterActive}
        trustLevel={trustLevel}
        fearIndex={fearIndex}
        agentLabel={trustAgentLabel}
      />
      <CardCollectibleOverlay
        showCard={showCard}
        demoEnded={demoEnded}
        cardCollecting={cardCollecting}
        cardLabelVisible={cardLabelVisible}
        cardId={currentCardId}
        onCollect={handleCollectCard}
      />
      <DemoEndOverlay
        endOverlayVisible={endOverlayVisible}
        mode={endMode}
        showPlayAgain={showPlayAgain}
        onPlayAgain={() => window.location.reload()}
        onStopMedia={onStopMedia}
      />
      <StatusNotices
        status={status}
        cameraObscuredVisible={cameraObscuredVisible}
        webcamDenied={webcamDenied}
        sessionActive={sessionActive}
        webcamDeniedVisible={webcamDeniedVisible}
      />
      <ErrorOverlay
        errorQueue={errorQueue}
        onDismiss={dismissError}
        onEndSession={handleReload}
      />
      {micDenied && !demoEnded && (
        <ErrorModal
          title="No Signal"
          message="Microphone access was denied. This experience requires your voice to proceed. We apologise — the session cannot continue without it."
          onEndSession={handleReload}
        />
      )}
    </div>
  );
}
