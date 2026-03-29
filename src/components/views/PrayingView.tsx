"use client";

import { useEffect } from "react";
import type { ThemeConfig } from "@/data/themes";
import type { RosaryStep, MeditationStep } from "@/utils/rosarySteps";
import type { TransitionData } from "@/hooks/useRosaryNavigation";
import type { PlaybackSpeed } from "@/hooks/useAudio";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { StepTransitionOverlay } from "@/components/overlays/StepTransitionOverlay";
import { PrayingHeader } from "@/components/layout/PrayingHeader";
import { PrayingFooter } from "@/components/layout/PrayingFooter";
import { PlayerFooter } from "@/components/layout/PlayerFooter";
import { RosaryVisual } from "@/components/rosary/RosaryVisual";
import { MeditationCard } from "@/components/cards/MeditationCard";
import { PrayerCard } from "@/components/cards/PrayerCard";
import { PauseIndicator } from "@/components/cards/PauseIndicator";
import { AppFooter } from "@/components/layout/AppFooter";

interface PrayingViewProps {
  theme: ThemeConfig;
  mysteryName: string;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: RosaryStep;
  currentActiveNodeId: number;
  beadCount: number;
  transition: TransitionData | null;
  isAudioEnabled: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isWaiting: boolean;
  prayerMode: "manual" | "auto";
  playbackSpeed: PlaybackSpeed;
  audioProgress: number;
  globalProgress: number;
  elapsedTime: number;
  totalTime: number;
  durationsLoaded: boolean;
  rosarySteps: RosaryStep[];
  onRestart: () => void;
  onToggleAudio: () => void;
  onPlayToggle: () => void;
  onPause: () => void;
  onResume: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

function getDisplaySubtitle(step: RosaryStep, beadCount: number): string | undefined {
  if (step.title === "3 Ave Marias") {
    if (beadCount === 0) return "A primeira Ave Maria em honra a Deus Pai que nos criou.";
    if (beadCount === 1) return "A segunda Ave Maria a Deus Filho que nos remiu.";
    if (beadCount === 2) return "A terceira Ave Maria ao Espírito Santo que nos santifica.";
  }
  if (step.type === "beads") return step.subtitle;
  return undefined;
}

export function PrayingView({
  theme,
  mysteryName,
  currentStepIndex,
  totalSteps,
  currentStep,
  currentActiveNodeId,
  beadCount,
  transition,
  isAudioEnabled,
  isPlaying,
  isPaused,
  isWaiting,
  prayerMode,
  playbackSpeed,
  audioProgress,
  globalProgress,
  elapsedTime,
  totalTime,
  durationsLoaded,
  rosarySteps,
  onRestart,
  onToggleAudio,
  onPlayToggle,
  onPause,
  onResume,
  onPrev,
  onNext,
  onSpeedChange,
}: PrayingViewProps) {
  const displaySubtitle = getDisplaySubtitle(currentStep, beadCount);
  const isTransitioning = transition !== null;

  // Preload images 2 steps ahead
  useEffect(() => {
    for (let offset = 1; offset <= 2; offset++) {
      const ahead = rosarySteps[currentStepIndex + offset];
      if (!ahead) continue;
      const urls: string[] = [];
      if (ahead.mysteryBackground) urls.push(ahead.mysteryBackground);
      if (ahead.type === "meditation") urls.push(ahead.image);
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [currentStepIndex, rosarySteps]);

  return (
    <BackgroundWrapper theme={theme} mysteryImage={currentStep.mysteryBackground}>
      <StepTransitionOverlay transition={transition} />

      <PrayingHeader
        mysteryName={mysteryName}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isAudioEnabled={isAudioEnabled}
        onRestart={onRestart}
        onToggleAudio={onToggleAudio}
      />

      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto px-4 pt-6 pb-36">
        <RosaryVisual theme={theme} currentActiveNodeId={currentActiveNodeId} />

        <div
          className={`w-full flex flex-col justify-start transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {currentStep.type === "meditation" && (
            <MeditationCard step={currentStep as MeditationStep} theme={theme} />
          )}

          {(currentStep.type === "prayer" || currentStep.type === "beads") && (
            <PrayerCard
              step={currentStep}
              beadCount={beadCount}
              displaySubtitle={displaySubtitle}
              theme={theme}
              isAudioEnabled={isAudioEnabled}
              isPlaying={isPlaying}
              audioProgress={audioProgress}
              onPlayToggle={onPlayToggle}
            />
          )}

          {prayerMode === "manual" && <PauseIndicator isWaiting={isWaiting} />}
        </div>

        <AppFooter />
      </main>

      {prayerMode === "auto" ? (
        <PlayerFooter
          isPlaying={isPlaying}
          isPaused={isPaused}
          isWaiting={isWaiting}
          playbackSpeed={playbackSpeed}
          globalProgress={globalProgress}
          elapsedTime={elapsedTime}
          totalTime={totalTime}
          durationsLoaded={durationsLoaded}
          canGoBack={currentStepIndex > 0 || beadCount > 0}
          isTransitioning={isTransitioning}
          onPause={onPause}
          onResume={onResume}
          onPrev={onPrev}
          onNext={onNext}
          onSpeedChange={onSpeedChange}
        />
      ) : (
        <PrayingFooter
          theme={theme}
          isBeads={currentStep.type === "beads"}
          canGoBack={currentStepIndex > 0 || beadCount > 0}
          isTransitioning={isTransitioning}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </BackgroundWrapper>
  );
}
