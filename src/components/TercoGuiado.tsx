"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { MYSTERIES, type MysteryKey } from "@/data/mysteries";
import { THEMES } from "@/data/themes";
import { getMysteryOfTheDay } from "@/utils/getMysteryOfTheDay";
import { buildRosarySteps } from "@/utils/rosarySteps";
import { useRosaryNavigation } from "@/hooks/useRosaryNavigation";
import { useAudio } from "@/hooks/useAudio";
import { useRosaryProgress } from "@/hooks/useRosaryProgress";
import { HomeView } from "@/components/views/HomeView";
import { ModeSelectionView } from "@/components/views/ModeSelectionView";
import { PrayingView } from "@/components/views/PrayingView";
import { FinishedView } from "@/components/views/FinishedView";
import { IntroOverlay } from "@/components/overlays/IntroOverlay";

type View = "home" | "mode-selection" | "praying" | "finished";
type IntroState = "idle" | "playing" | "fading" | "done";

export function TercoGuiado() {
  const [view, setView] = useState<View>("home");
  const [introState, setIntroState] = useState<IntroState>("idle");
  const [selectedMysteryKey, setSelectedMysteryKey] = useState<MysteryKey>(getMysteryOfTheDay);
  const [prayerMode, setPrayerMode] = useState<"manual" | "auto">("auto");
  const isPopstateRef = useRef(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const didRestoreHash = useRef(false);

  const theme = THEMES[selectedMysteryKey];
  const rosarySteps = useMemo(() => buildRosarySteps(selectedMysteryKey), [selectedMysteryKey]);

  const onFinish = useCallback(() => {
    setView("finished");
    history.pushState({ view: "finished" }, "", "#finalizado");
  }, []);

  const {
    currentStepIndex,
    beadCount,
    currentStep,
    currentActiveNodeId,
    transition,
    handleNext,
    handlePrev,
    reset: resetNavigation,
    goTo,
  } = useRosaryNavigation({
    rosarySteps,
    stopAudio: () => audioControls.stopAudio(),
    onFinish,
  });

  const audioControls = useAudio({
    view,
    currentStepIndex,
    beadCount,
    rosarySteps,
    isTransitioning: transition !== null,
    onNext: handleNext,
    prayerMode,
    mysteryKey: selectedMysteryKey,
  });

  const { totalTime, elapsedTime, globalProgress, durationsLoaded } =
    useRosaryProgress({
      rosarySteps,
      mysteryKey: selectedMysteryKey,
      currentStepIndex,
      beadCount,
      audioProgress: audioControls.audioProgress,
      pauseProgress: audioControls.pauseProgress,
      playbackSpeed: audioControls.playbackSpeed,
    });

  // Restore state from URL hash on initial load
  useEffect(() => {
    if (didRestoreHash.current) return;
    didRestoreHash.current = true;

    const hash = window.location.hash;
    const rezandoMatch = hash.match(
      /^#rezando\/(gozosos|luminosos|dolorosos|gloriosos)\/(auto|manual)\/(\d+)\/(\d+)$/,
    );
    if (rezandoMatch) {
      const mystery = rezandoMatch[1] as MysteryKey;
      const mode = rezandoMatch[2] as "manual" | "auto";
      const step = parseInt(rezandoMatch[3], 10);
      const bead = parseInt(rezandoMatch[4], 10);
      setSelectedMysteryKey(mystery);
      setPrayerMode(mode);
      setView("praying");
      setIntroState("done");
      setTimeout(() => goTo(step, bead), 0);
    } else if (hash === "#finalizado") {
      setView("finished");
    }
  }, [goTo]);

  // Sync prayer progress → URL hash
  useEffect(() => {
    if (isPopstateRef.current) {
      isPopstateRef.current = false;
      return;
    }
    if (view !== "praying") return;
    const hash = `#rezando/${selectedMysteryKey}/${prayerMode}/${currentStepIndex}/${beadCount}`;
    history.pushState(
      { view: "praying", mystery: selectedMysteryKey, mode: prayerMode, step: currentStepIndex, bead: beadCount },
      "",
      hash,
    );
  }, [view, selectedMysteryKey, prayerMode, currentStepIndex, beadCount]);

  // Handle browser back/forward
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      isPopstateRef.current = true;
      const state = e.state;
      if (state?.view === "praying") {
        setView("praying");
        if (state.mystery) setSelectedMysteryKey(state.mystery);
        if (state.mode) setPrayerMode(state.mode);
        goTo(state.step, state.bead);
      } else if (state?.view === "mode-selection") {
        setView("mode-selection");
      } else if (state?.view === "finished") {
        setView("finished");
      } else {
        audioControls.stopAudio();
        resetNavigation();
        setView("home");
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [goTo, audioControls.stopAudio, resetNavigation]);

  const handleStartSequence = useCallback(() => {
    setView("mode-selection");
    history.pushState({ view: "mode-selection" }, "", "#modo");
  }, []);

  const handleModeConfirm = useCallback((mode: "manual" | "auto", withAudio: boolean) => {
    setPrayerMode(mode);
    audioControls.setAudioEnabled(withAudio);
    setIntroState("playing");

    // Play sinal da cruz audio
    if (withAudio) {
      const audio = new Audio("/audio/oracoes/sinal-cruz.mp3");
      introAudioRef.current = audio;
      audio.play().catch(() => {});
    }

    setTimeout(() => {
      setIntroState("fading");
      resetNavigation();
      setView("praying");
      window.scrollTo(0, 0);
    }, 3500);
    setTimeout(() => {
      setIntroState("done");
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current = null;
      }
    }, 4500);
  }, [resetNavigation, audioControls]);

  const handleModeBack = useCallback(() => {
    setView("home");
    history.back();
  }, []);

  const handleRestart = useCallback(() => {
    audioControls.stopAudio();
    resetNavigation();
    setView("home");
    history.replaceState(null, "", window.location.pathname);
  }, [audioControls, resetNavigation]);

  const handlePlayToggle = useCallback(() => {
    if (audioControls.isPlaying) {
      audioControls.stopAudio();
    } else {
      audioControls.speakText(currentStep, beadCount);
    }
  }, [audioControls, currentStep, beadCount]);

  return (
    <>
      <IntroOverlay introState={introState} />

      {view === "home" && (
        <HomeView
          theme={theme}
          selectedMysteryKey={selectedMysteryKey}
          onSelectMystery={setSelectedMysteryKey}
          onStart={handleStartSequence}
        />
      )}

      {view === "mode-selection" && (
        <ModeSelectionView
          theme={theme}
          mysteryName={MYSTERIES[selectedMysteryKey].name}
          onConfirm={handleModeConfirm}
          onBack={handleModeBack}
        />
      )}

      {view === "finished" && (
        <FinishedView theme={theme} onRestart={handleRestart} />
      )}

      {view === "praying" && (
        <PrayingView
          theme={theme}
          mysteryName={MYSTERIES[selectedMysteryKey].name}
          currentStepIndex={currentStepIndex}
          totalSteps={rosarySteps.length}
          currentStep={currentStep}
          currentActiveNodeId={currentActiveNodeId}
          beadCount={beadCount}
          transition={transition}
          isAudioEnabled={audioControls.isAudioEnabled}
          isPlaying={audioControls.isPlaying}
          isPaused={audioControls.isPaused}
          isWaiting={audioControls.isWaiting}
          prayerMode={prayerMode}
          playbackSpeed={audioControls.playbackSpeed}
          audioProgress={audioControls.audioProgress}
          globalProgress={globalProgress}
          elapsedTime={elapsedTime}
          totalTime={totalTime}
          durationsLoaded={durationsLoaded}
          rosarySteps={rosarySteps}
          onRestart={handleRestart}
          onToggleAudio={audioControls.toggleAutoPlay}
          onPlayToggle={handlePlayToggle}
          onPause={audioControls.pauseAudio}
          onResume={audioControls.resumeAudio}
          onPrev={handlePrev}
          onNext={handleNext}
          onSpeedChange={audioControls.setPlaybackSpeed}
        />
      )}
    </>
  );
}
