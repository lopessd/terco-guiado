"use client";

import { useState, useMemo, useCallback } from "react";
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

  const theme = THEMES[selectedMysteryKey];
  const rosarySteps = useMemo(() => buildRosarySteps(selectedMysteryKey), [selectedMysteryKey]);

  const onFinish = useCallback(() => setView("finished"), []);

  const {
    currentStepIndex,
    beadCount,
    currentStep,
    currentActiveNodeId,
    transition,
    handleNext,
    handlePrev,
    reset: resetNavigation,
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

  const handleStartSequence = useCallback(() => {
    setIntroState("playing");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }

    setTimeout(() => setIntroState("fading"), 3500);
    setTimeout(() => {
      setIntroState("done");
      resetNavigation();
      setView("praying");
      window.scrollTo(0, 0);
    }, 4500);
  }, [resetNavigation]);

  const handleRestart = useCallback(() => {
    audioControls.stopAudio();
    resetNavigation();
    setView("home");
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
