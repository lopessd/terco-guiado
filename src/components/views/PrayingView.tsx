"use client";

import type { ThemeConfig } from "@/data/themes";
import type { RosaryStep, MeditationStep } from "@/utils/rosarySteps";
import type { TransitionData } from "@/hooks/useRosaryNavigation";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { StepTransitionOverlay } from "@/components/overlays/StepTransitionOverlay";
import { PrayingHeader } from "@/components/layout/PrayingHeader";
import { PrayingFooter } from "@/components/layout/PrayingFooter";
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
  isWaiting: boolean;
  onRestart: () => void;
  onToggleAudio: () => void;
  onPlayToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
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
  isWaiting,
  onRestart,
  onToggleAudio,
  onPlayToggle,
  onPrev,
  onNext,
}: PrayingViewProps) {
  const displaySubtitle = getDisplaySubtitle(currentStep, beadCount);
  const isTransitioning = transition !== null;

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

      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto px-4 pt-6 pb-40">
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
              onPlayToggle={onPlayToggle}
            />
          )}

          <PauseIndicator isWaiting={isWaiting} />
        </div>

        <AppFooter />
      </main>

      <PrayingFooter
        theme={theme}
        isBeads={currentStep.type === "beads"}
        canGoBack={currentStepIndex > 0 || beadCount > 0}
        isTransitioning={isTransitioning}
        onPrev={onPrev}
        onNext={onNext}
      />
    </BackgroundWrapper>
  );
}
