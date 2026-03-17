"use client";

import { useState, useCallback } from "react";
import type { RosaryStep } from "@/utils/rosarySteps";

export interface TransitionData {
  title: string;
  image?: string;
}

interface UseRosaryNavigationOptions {
  rosarySteps: RosaryStep[];
  stopAudio: () => void;
  onFinish: () => void;
}

export function useRosaryNavigation({
  rosarySteps,
  stopAudio,
  onFinish,
}: UseRosaryNavigationOptions) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [beadCount, setBeadCount] = useState(0);
  const [transition, setTransition] = useState<TransitionData | null>(null);

  const currentStep = rosarySteps[currentStepIndex];
  const currentActiveNodeId =
    currentStep.type === "beads"
      ? currentStep.beadIds[beadCount]
      : currentStep.activeId;

  const changeStepWithTransition = useCallback(
    (newStepIdx: number, newBeadIdx: number) => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (newStepIdx !== currentStepIndex) {
        stopAudio();
        const nextStep = rosarySteps[newStepIdx];
        const currentMystery = rosarySteps[currentStepIndex].mysteryImage;
        const nextMystery = nextStep.mysteryImage;
        const isNewMystery = nextStep.type === "meditation" && nextMystery !== currentMystery;

        setTransition({
          title: nextStep.title,
          image: isNewMystery ? nextStep.mysteryImage : undefined,
        });

        const duration = isNewMystery ? 2500 : 1200;
        setTimeout(() => {
          setTransition(null);
          setCurrentStepIndex(newStepIdx);
          setBeadCount(newBeadIdx);
        }, duration);
      } else {
        setBeadCount(newBeadIdx);
      }
    },
    [currentStepIndex, rosarySteps, stopAudio]
  );

  const handleNext = useCallback(() => {
    if (transition) return;
    if (currentStep.type === "beads" && beadCount < currentStep.beadIds.length - 1) {
      changeStepWithTransition(currentStepIndex, beadCount + 1);
    } else if (currentStepIndex < rosarySteps.length - 1) {
      changeStepWithTransition(currentStepIndex + 1, 0);
    } else {
      onFinish();
    }
  }, [
    transition,
    currentStep,
    beadCount,
    currentStepIndex,
    rosarySteps.length,
    changeStepWithTransition,
    onFinish,
  ]);

  const handlePrev = useCallback(() => {
    if (transition) return;
    if (currentStep.type === "beads" && beadCount > 0) {
      changeStepWithTransition(currentStepIndex, beadCount - 1);
    } else if (currentStepIndex > 0) {
      const prevStep = rosarySteps[currentStepIndex - 1];
      const newBeadCount =
        prevStep.type === "beads" ? prevStep.beadIds.length - 1 : 0;
      changeStepWithTransition(currentStepIndex - 1, newBeadCount);
    }
  }, [
    transition,
    currentStep,
    beadCount,
    currentStepIndex,
    rosarySteps,
    changeStepWithTransition,
  ]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setBeadCount(0);
    setTransition(null);
  }, []);

  return {
    currentStepIndex,
    beadCount,
    currentStep,
    currentActiveNodeId,
    transition,
    handleNext,
    handlePrev,
    reset,
  };
}
