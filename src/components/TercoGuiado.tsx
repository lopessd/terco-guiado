"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { MYSTERIES, type MysteryKey } from "@/data/mysteries";
import { THEMES } from "@/data/themes";
import { getMysteryOfTheDay } from "@/utils/getMysteryOfTheDay";
import { buildRosarySteps } from "@/utils/rosarySteps";
import { useRosaryNavigation } from "@/hooks/useRosaryNavigation";
import { useAudio } from "@/hooks/useAudio";
import { HomeView } from "@/components/views/HomeView";
import { PrayingView } from "@/components/views/PrayingView";
import { FinishedView } from "@/components/views/FinishedView";

type View = "home" | "praying" | "finished";
type IntroState = "idle" | "playing" | "fading" | "done";

export function TercoGuiado() {
  const [view, setView] = useState<View>("home");
  const [introState, setIntroState] = useState<IntroState>("idle");
  const [selectedMysteryKey, setSelectedMysteryKey] = useState<MysteryKey>(getMysteryOfTheDay);
  const isPopstateRef = useRef(false);

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
  });

  // Sync prayer progress → URL hash
  useEffect(() => {
    if (isPopstateRef.current) {
      isPopstateRef.current = false;
      return;
    }
    if (view !== "praying") return;
    const hash = `#rezando/${selectedMysteryKey}/${currentStepIndex}/${beadCount}`;
    history.pushState(
      { view: "praying", mystery: selectedMysteryKey, step: currentStepIndex, bead: beadCount },
      "",
      hash,
    );
  }, [view, selectedMysteryKey, currentStepIndex, beadCount]);

  // Handle browser back/forward
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      isPopstateRef.current = true;
      const state = e.state;
      if (state?.view === "praying") {
        setView("praying");
        if (state.mystery) setSelectedMysteryKey(state.mystery);
        goTo(state.step, state.bead);
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
    setIntroState("playing");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }

    setTimeout(() => {
      setIntroState("fading");
      resetNavigation();
      setView("praying");
      window.scrollTo(0, 0);
    }, 3500);
    setTimeout(() => setIntroState("done"), 4500);
  }, [resetNavigation]);

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

  if (view === "home") {
    return (
      <HomeView
        theme={theme}
        introState={introState}
        selectedMysteryKey={selectedMysteryKey}
        onSelectMystery={setSelectedMysteryKey}
        onStart={handleStartSequence}
      />
    );
  }

  if (view === "finished") {
    return <FinishedView theme={theme} onRestart={handleRestart} />;
  }

  return (
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
      isWaiting={audioControls.isWaiting}
      onRestart={handleRestart}
      onToggleAudio={audioControls.toggleAutoPlay}
      onPlayToggle={handlePlayToggle}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
}
